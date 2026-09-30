from locust import HttpUser, task, between

class HospitalAPIUser(HttpUser):
    # Waits 1 to 3 seconds between requests to simulate real users
    wait_time = between(1, 3)

    @task(3)
    def load_dashboard_data(self):
        self.client.get("/patients/")
        self.client.get("/doctors/")
        self.client.get("/appointments/")

    @task(2)
    def view_doctors_list(self):
        self.client.get("/doctors/")

    @task(1)
    def view_patients_list(self):
        self.client.get("/patients/")