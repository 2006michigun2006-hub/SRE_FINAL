output "db_container_id" {
  description = "ID of the MongoDB container"
  value       = docker_container.db.id
}