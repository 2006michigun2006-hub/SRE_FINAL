terraform {
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "2.20.0"
    }
  }
}

provider "docker" {
  host = "unix:///var/run/docker.sock?version=1.41"
}

resource "docker_network" "app_network" {
  name = "hyperbrain_network"
}

resource "docker_image" "mongo" {
  name         = "mongo:latest"
  keep_locally = false
}

resource "docker_container" "db" {
  image = docker_image.mongo.latest
  name  = var.db_container_name
  ports {
    internal = 27017
    external = 27017
  }
  networks_advanced {
    name = docker_network.app_network.name
  }
}