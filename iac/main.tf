terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "6.8.0"
    }
  }
}

provider "google" {
  project = var.project
  region  = var.region
  zone    = var.zone
}

locals {
  sa_creds = jsondecode(base64decode(var.encoded_credentials))
}

import {
  id = "projects/${var.project}/locations/${var.region}/services/${var.service_name}"
  to = google_cloud_run_v2_service.default
}

resource "google_cloud_run_v2_service" "default" {
  name                = var.service_name
  location            = var.region
  deletion_protection = true
  ingress             = "INGRESS_TRAFFIC_ALL"

  traffic {
    type    = "TRAFFIC_TARGET_ALLOCATION_TYPE_LATEST"
    percent = 100
  }

  template {
    timeout                          = "300s"
    max_instance_request_concurrency = 80
    service_account                  = local.sa_creds.client_email

    containers {
      name  = var.container_name
      image = var.image

      ports {
        name           = "http1"
        container_port = 8080
      }

      env {
        name  = "CLIENT_ID"
        value = var.client_id
      }
      env {
        name  = "CLIENT_SECRET"
        value = var.client_secret
      }
      env {
        name  = "ENCODED_CREDENTIALS"
        value = var.encoded_credentials
      }

      resources {
        cpu_idle = true
        limits = {
          cpu    = "1000m"
          memory = "512Mi"
        }
        startup_cpu_boost = true
      }

      startup_probe {
        timeout_seconds   = 240
        period_seconds    = 240
        failure_threshold = 1

        tcp_socket {
          port = 8080
        }
      }
    }
  }
}