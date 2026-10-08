package nu.local4local.backend.resourcefully

fun getEnvRequired(name: String): String {
    return System.getenv(name) ?: throw IllegalArgumentException("Environment variable $name is required")
}
