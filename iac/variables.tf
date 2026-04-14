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

variable "encoded_credentials" { }

variable "client_secret" { }

variable "client_id" { }

variable "image" {
  description = "Container image to deploy (defaults to the image tag for the main branch)"
  default     = "docker.io/garridoy/tm-with-friends:main"
}