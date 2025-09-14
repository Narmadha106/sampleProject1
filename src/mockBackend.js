// Mock backend for testing
let requests = [];
let donors = [];
let availability = [
  { organName: "Heart", availableUnits: 2 },
  { organName: "Liver", availableUnits: 3 },
  { organName: "Kidney", availableUnits: 5 },
  { organName: "Lung", availableUnits: 1 }
];

const validOrgans = ["Heart", "Liver", "Kidney", "Lung", "Pancreas", "Intestine", "Cornea", "Skin", "Bone"];

// Mock API functions
window.mockAPI = {
  createRequest: (requestData) => {
    const newRequest = {
      id: Date.now(),
      ...requestData,
      status: 'PENDING'
    };
    requests.push(newRequest);
    return newRequest;
  },
  
  getRequests: () => requests,
  
  getDonors: () => donors,
  
  getAvailability: () => availability,
  
  getValidOrgans: () => validOrgans,
  
  assignOrgan: (requestId) => {
    const request = requests.find(r => r.id === requestId);
    if (request) {
      request.status = 'FULFILLED';
    }
    return request;
  },
  
  rejectRequest: (requestId) => {
    const request = requests.find(r => r.id === requestId);
    if (request) {
      request.status = 'CANCELED';
    }
    return request;
  }
};