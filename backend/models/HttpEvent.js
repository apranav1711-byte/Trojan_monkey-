// In-memory event storage for demo purposes
const events = [];

export default {
  insertMany: async (arr) => {
    // Add _id to each event if not present
    const eventsWithIds = arr.map((e, idx) => ({
      ...e,
      _id: e._id || `log-${Date.now()}-${idx}`,
    }));
    events.push(...eventsWithIds);
    return eventsWithIds;
  },
  find: async () => events.slice(),
  countDocuments: async (filter={}) => {
    // Only support isAttack/isSuccessful count filters from routes
    if(Object.keys(filter).length === 0) return events.length;
    if(filter.isAttack !== undefined) return events.filter(e=>e.isAttack === filter.isAttack).length;
    if(filter.isSuccessful !== undefined) return events.filter(e=>e.isSuccessful === filter.isSuccessful).length;
    return 0;
  },
  // For sorting (descending by timestamp and limiting)
  findSortLimit: async (limit=200) => {
    return events.slice().sort((a,b)=>{
      return (new Date(b.timestamp) - new Date(a.timestamp));
    }).slice(0,limit);
  },
  // Find by ID
  findById: async (id) => {
    // Try to find by _id field (supports both log-timestamp-index and simple IDs)
    return events.find(e => e._id === id || e.id === id) || null;
  }
};