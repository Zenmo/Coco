package nu.local4local.backend.resourcefully

import java.sql.Connection
import java.sql.DriverManager
import kotlin.use

class ResourcefullyStorage(
    private val url: String = getEnvRequired("POSTGRES_URL"),
    private val user: String = getEnvRequired("POSTGRES_USER"),
    private val password: String = getEnvRequired("POSTGRES_PASSWORD"),
    private val connection: Connection = DriverManager.getConnection(url, user, password)
) {

    init {
        connection.createStatement().use { stmt ->
            stmt.execute(
                """
                CREATE TABLE IF NOT EXISTS resourcefully_requests (
                    id SERIAL PRIMARY KEY,
                    timestamp TIMESTAMP DEFAULT NOW(),
                    organization TEXT,
                    name TEXT,
                    email TEXT
                )
            """.trimIndent()
            )
        }
    }

    fun save(organization: String?, name: String?, email: String?) {
        connection.prepareStatement(
            """
            INSERT INTO resourcefully_requests (organization, name, email)
            VALUES (?, ?, ?)
        """.trimIndent()
        ).use { stmt ->
            stmt.setString(1, organization)
            stmt.setString(2, name)
            stmt.setString(3, email)
            stmt.executeUpdate()
        }
    }
}
