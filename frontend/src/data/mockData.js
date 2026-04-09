export const mockData = {
  userStats: {
    totalBookings: 12,
    activeServices: 2,
    pendingRequests: 1,
  },
  workerStats: {
    totalJobs: 45,
    completedJobs: 42,
    earnings: "$3,450.00",
  },
  adminStats: {
    totalUsers: 1250,
    totalWorkers: 320,
    totalRevenue: "$45,200",
    activeServices: 85,
  },
  services: [
    { id: 1, title: 'House Cleaning', category: 'Cleaning', price: '$50/hr', status: 'Active' },
    { id: 2, title: 'Plumbing Repair', category: 'Maintenance', price: '$80/hr', status: 'Active' },
    { id: 3, title: 'Electrical Wiring', category: 'Maintenance', price: '$90/hr', status: 'Pending' },
    { id: 4, title: 'Deep Cleaning', category: 'Cleaning', price: '$150 flat', status: 'Active' },
  ],
  availableJobs: [
    { id: 101, title: 'Fix Leaking Sink', location: 'Downtown Apt 4B', price: '$80', date: 'Oct 12' },
    { id: 102, title: 'Move-out Cleaning', location: 'Westside Suburb', price: '$150', date: 'Oct 14' },
    { id: 103, title: 'Install Ceiling Fan', location: 'North Hills 12', price: '$60', date: 'Oct 15' },
  ],
  users: [
    { id: 1, name: 'Alice Smith', email: 'alice@example.com', role: 'User', status: 'Active' },
    { id: 2, name: 'Bob Johnson', email: 'bob@example.com', role: 'User', status: 'Active' },
  ],
  workers: [
    { id: 1, name: 'Mike Plumber', email: 'mike@fixit.com', jobsCompleted: 120, rating: '4.8' },
    { id: 2, name: 'Sarah Cleaner', email: 'sarah@clean.com', jobsCompleted: 85, rating: '4.9' },
  ]
};
