import { addInteraction, removeInteraction } from "./firebase";

type InteractionType = "agreed" | "dissented";
type Interactions = {
  agreed: Record<string, boolean>;
  dissented: Record<string, boolean>;
};

class InteractionStore {
  private state: Record<string, Interactions> = {};
  private listeners: Record<string, Set<(state: Interactions) => void>> = {};

  // Timers and Locks
  private lastSyncTime: Record<string, number> = {};

  // FIX: Use ReturnType<typeof setTimeout> to support both Node and RN environments
  private pendingDebounce: Record<string, ReturnType<typeof setTimeout>> = {};

  // A timestamp until which we IGNORE server updates for the current user
  private optimisticLocks: Record<string, number> = {};

  private sanitize(data?: Partial<Interactions>): Interactions {
    return {
      agreed: data?.agreed || {},
      dissented: data?.dissented || {},
    };
  }

  get(postId: string): Interactions {
    return this.sanitize(this.state[postId]);
  }

  subscribe(postId: string, callback: (state: Interactions) => void) {
    if (!this.listeners[postId]) this.listeners[postId] = new Set();
    this.listeners[postId].add(callback);
    callback(this.get(postId));
    return () => {
      this.listeners[postId]?.delete(callback);
      if (this.listeners[postId]?.size === 0) delete this.listeners[postId];
    };
  }

  syncFromServer(
    postId: string,
    serverData: Interactions,
    currentUid?: string,
  ) {
    const safeServerData = this.sanitize(serverData);
    const currentState = this.get(postId);

    const isDebouncing = !!this.pendingDebounce[postId];
    const isLocked =
      this.optimisticLocks[postId] && Date.now() < this.optimisticLocks[postId];
    const shouldProtectLocalState = currentUid && (isDebouncing || isLocked);

    // Trust Server
    if (!shouldProtectLocalState) {
      if (JSON.stringify(safeServerData) !== JSON.stringify(currentState)) {
        this.state[postId] = safeServerData;
        this.notify(postId);
      }
      return;
    }

    // Merge Logic (Protected)
    const mergedState = {
      agreed: { ...safeServerData.agreed },
      dissented: { ...safeServerData.dissented },
    };

    const localAgreed = !!currentState.agreed[currentUid!];
    const localDissented = !!currentState.dissented[currentUid!];

    if (localAgreed) mergedState.agreed[currentUid!] = true;
    else delete mergedState.agreed[currentUid!];

    if (localDissented) mergedState.dissented[currentUid!] = true;
    else delete mergedState.dissented[currentUid!];

    if (JSON.stringify(mergedState) !== JSON.stringify(currentState)) {
      this.state[postId] = mergedState;
      this.notify(postId);
    }
  }

  async toggle(
    postId: string,
    uid: string,
    type: InteractionType,
    parentPostId?: string,
  ) {
    if (!this.state[postId]) this.state[postId] = { agreed: {}, dissented: {} };
    if (!this.state[postId].agreed) this.state[postId].agreed = {};
    if (!this.state[postId].dissented) this.state[postId].dissented = {};

    const current = this.state[postId];
    const otherType = type === "agreed" ? "dissented" : "agreed";

    // Optimistic Update
    const next = {
      agreed: { ...current.agreed },
      dissented: { ...current.dissented },
    };

    const wasActive = !!next[type][uid];
    const wasOtherActive = !!next[otherType][uid];

    if (wasActive) {
      delete next[type][uid];
    } else {
      next[type][uid] = true;
      if (wasOtherActive) delete next[otherType][uid];
    }

    this.state[postId] = next;
    this.optimisticLocks[postId] = Date.now() + 2000;
    this.notify(postId);

    // Sync Logic
    if (this.pendingDebounce[postId]) {
      clearTimeout(this.pendingDebounce[postId]);
    }

    const now = Date.now();
    const lastSync = this.lastSyncTime[postId] || 0;
    const timeSinceLastSync = now - lastSync;
    const COOLDOWN_PERIOD = 2000;

    const executeSync = async () => {
      delete this.pendingDebounce[postId];
      this.lastSyncTime[postId] = Date.now();

      try {
        if (!wasActive) {
          await addInteraction(postId, uid, type, parentPostId);
          if (wasOtherActive)
            await removeInteraction(postId, uid, otherType, parentPostId);
        } else {
          await removeInteraction(postId, uid, type, parentPostId);
        }
      } catch (err) {
        console.error("Sync failed", err);
      }
    };

    if (timeSinceLastSync > COOLDOWN_PERIOD) {
      executeSync();
    } else {
      this.pendingDebounce[postId] = setTimeout(executeSync, 500);
    }
  }

  private notify(postId: string) {
    const data = this.get(postId);
    this.listeners[postId]?.forEach((cb) => cb(data));
  }
}

export const interactionStore = new InteractionStore();
