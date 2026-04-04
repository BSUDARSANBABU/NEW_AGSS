// API service for backend integration
const API_BASE_URL = 'http://localhost:8000';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;

    // Determine if we're sending form data (for file uploads)
    const isFormData = options.body instanceof FormData;

    const config = {
      headers: isFormData ? {} : {
        'Content-Type': 'application/json',
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Handle empty responses (like from DELETE requests)
      const text = await response.text();
      if (!text) {
        return null; // Return null for empty responses
      }

      const data = JSON.parse(text);
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // GET request
  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  // POST request
  async post(endpoint, data) {
    // Handle both JSON and FormData
    if (data instanceof FormData) {
      return this.request(endpoint, {
        method: 'POST',
        body: data,
      });
    } else {
      return this.request(endpoint, {
        method: 'POST',
        body: JSON.stringify(data),
      });
    }
  }

  // PUT request
  async put(endpoint, data) {
    // Handle both JSON and FormData
    if (data instanceof FormData) {
      return this.request(endpoint, {
        method: 'PUT',
        body: data,
      });
    } else {
      return this.request(endpoint, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    }
  }

  // DELETE request
  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }

  // File upload (multipart/form-data)
  async upload(endpoint, formData) {
    const url = `${this.baseURL}${endpoint}`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Upload failed:', error);
      throw error;
    }
  }

  // Specific API methods

  // Developers
  async getDevelopers() {
    return this.get('/developers/');
  }

  async createDeveloper(developerData) {
    return this.post('/developers/', developerData);
  }

  async updateDeveloper(id, developerData) {
    return this.put(`/developers/${id}/`, developerData);
  }

  async deleteDeveloper(id) {
    return this.delete(`/developers/${id}/`);
  }

  // Projects
  async getProjects() {
    return this.get('/projects/');
  }

  async createProject(projectData) {
    return this.post('/projects/', projectData);
  }

  async updateProject(id, projectData) {
    return this.put(`/projects/${id}/`, projectData);
  }

  async deleteProject(id) {
    return this.delete(`/projects/${id}/`);
  }

  async getProjectImages(projectId) {
    return this.get(`/projects/${projectId}/images/`);
  }

  async getProjectImagesNested(projectId) {
    return this.get(`/projects/${projectId}/images/`);
  }

  // Resources
  async getResources(filters = {}) {
    const params = new URLSearchParams();

    if (filters.category) params.append('category', filters.category);
    if (filters.author) params.append('author', filters.author);
    if (filters.tool_type) params.append('tool_type', filters.tool_type);
    if (filters.date_from) params.append('date_from', filters.date_from);
    if (filters.date_to) params.append('date_to', filters.date_to);
    if (filters.search) params.append('search', filters.search);
    if (filters.sorting) params.append('ordering', filters.sorting);

    const queryString = params.toString();
    const endpoint = queryString ? `/resources/?${queryString}` : '/resources/';
    return this.get(endpoint);
  }

  async createResource(resourceData) {
    return this.post('/resources/', resourceData);
  }

  async updateResource(id, resourceData) {
    return this.put(`/resources/${id}/`, resourceData);
  }

  async deleteResource(id) {
    return this.delete(`/resources/${id}/`);
  }

  // Reviews
  async getReviews(projectId = null) {
    const endpoint = projectId ? `/performance-reviews/?project=${projectId}` : '/performance-reviews/';
    return this.get(endpoint);
  }

  async createReview(reviewData) {
    return this.post('/performance-reviews/', reviewData);
  }

  // Jobs
  async getJobs() {
    return this.get('/jobs/');
  }

  async createJob(jobData) {
    return this.post('/jobs/', jobData);
  }

  async updateJob(id, jobData) {
    return this.put(`/jobs/${id}/`, jobData);
  }

  async deleteJob(id) {
    return this.delete(`/jobs/${id}/`);
  }

  // Job Applications
  async getJobApplications() {
    return this.get('/job-applications/');
  }

  async createJobApplication(applicationData) {
    return this.post('/job-applications/', applicationData);
  }

  async updateJobApplication(id, applicationData) {
    return this.put(`/job-applications/${id}/`, applicationData);
  }

  // Demo Bookings
  async getDemoBookings() {
    return this.get('/demo-bookings/');
  }

  async createDemoBooking(bookingData) {
    return this.post('/demo-bookings/', bookingData);
  }

  async updateDemoBooking(id, bookingData) {
    return this.put(`/demo-bookings/${id}/`, bookingData);
  }

  async deleteDemoBooking(id) {
    return this.delete(`/demo-bookings/${id}/`);
  }

  // Customers
  async registerCustomer(customerData) {
    return this.post('/customer/register/', customerData);
  }

  async loginCustomer(credentials) {
    return this.post('/customer/login/', credentials);
  }

  // Documentation
  async getDocumentation() {
    return this.get('/documentation/');
  }

  async createDocumentation(docData) {
    return this.post('/documentation/', docData);
  }

  async updateDocumentation(id, docData) {
    return this.put(`/documentation/${id}/`, docData);
  }

  async deleteDocumentation(id) {
    return this.delete(`/documentation/${id}/`);
  }

  // Site Settings
  async getSiteSettings() {
    return this.get('/site-settings/');
  }

  // Footer
  async getFooter() {
    return this.get('/footer/');
  }

  async createFooter(footerData) {
    return this.post('/footer/', footerData);
  }

  async updateFooter(id, footerData) {
    return this.put(`/footer/${id}/`, footerData);
  }

  // OTP
  async sendOTP(email) {
    return this.post('/send-otp/', { email });
  }

  async verifyOTP(email, otp) {
    return this.post('/verify-otp/', { email, otp });
  }

  // Performance Reviews
  async getPerformanceReviews() {
    return this.get('/performance-reviews/');
  }

  async createPerformanceReview(reviewData) {
    return this.post('/performance-reviews/', reviewData);
  }

  async updatePerformanceReview(id, reviewData) {
    return this.put(`/performance-reviews/${id}/`, reviewData);
  }

  async deletePerformanceReview(id) {
    return this.delete(`/performance-reviews/${id}/`);
  }

  // Site Settings Update
  async updateSiteSettings(formData) {
    return this.put('/site-settings/1/', formData);
  }
}

export const apiService = new ApiService();
export default apiService;
