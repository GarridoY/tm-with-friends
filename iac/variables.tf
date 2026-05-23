variable "project" {
  default = "tm-with-friends"
}

variable "region" {
  default = "europe-west1"
}

variable "zone" {
  default = "europe-west1-c"
}

variable "container_name" {
  default = "tm-with-friends-1"
}


variable "service_name" {
  default = "web1-tm-with-friends"
}

variable "google_credentials" {
  type        = string
  sensitive   = true
  description = "Google service account JSON"
}

variable "encoded_credentials" {
  type        = string
  sensitive   = true
  description = "Application-encoded credentials (used by the app)."
}

variable "client_secret" {
  type        = string
  sensitive   = true
  description = "OAuth client secret."
}

variable "client_id" {
  type        = string
  sensitive   = true
  description = "OAuth client ID."
}

variable "image" {
  description = "Container image to deploy (defaults to the image tag for the main branch)"
  default     = "docker.io/garridoy/tm-with-friends:main"
}