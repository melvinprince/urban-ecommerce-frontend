// utils/eventBus.js

const EventBus = {
  events: {},

  /**
   * Subscribe to an event
   * @param {string} event - Event name
   * @param {Function} listener - Callback function
   */
  on(event, listener) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(listener);
  },

  /**
   * Emit an event to all listeners
   * @param {string} event - Event name
   * @param {*} data - Data to pass to listeners
   */
  emit(event, data) {
    if (this.events[event]) {
      this.events[event].forEach((listener) => listener(data));
    }
  },

  /**
   * Remove a listener from an event
   * @param {string} event - Event name
   * @param {Function} listener - Callback function to remove
   */
  off(event, listener) {
    if (!this.events[event]) return;
    this.events[event] = this.events[event].filter((l) => l !== listener);
  },

  /**
   * Remove all listeners for an event
   * @param {string} event - Event name
   */
  clear(event) {
    if (this.events[event]) {
      delete this.events[event];
    }
  },

  /**
   * Remove all events and listeners
   */
  clearAll() {
    this.events = {};
  },
};

export default EventBus;
