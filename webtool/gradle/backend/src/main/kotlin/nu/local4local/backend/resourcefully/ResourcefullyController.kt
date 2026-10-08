package nu.local4local.backend.resourcefully

import nu.local4local.backend.CocoKotlinxSerialization
import nu.local4local.common.resourcefully.ResourcefullyExport
import org.http4k.client.JavaHttpClient
import org.http4k.core.ContentType
import org.http4k.core.Method
import org.http4k.core.Request
import org.http4k.lens.bearerAuth
import org.http4k.lens.contentType
import org.http4k.routing.bind
import org.http4k.routing.routes

class ResourcefullyController(
    private val storage: ResourcefullyStorage = ResourcefullyStorage(),
    private val bearerToken: String = getEnvRequired("RESOURCEFULLY_BEARER_TOKEN")
) {
    val httpClient = JavaHttpClient()

    val routes = routes(
        // proxy to resourcefully because it's probably easier then letting them set CORS headers
        "/resourcefully-report" bind Method.POST to { req ->
            val data = req.bodyString()
            val url = "https://flexplus.resourcefully.nl/enapi/v1/calculations/07a380c5-e86c-4195-aa21-c957e04e13e7/local4local-report"

            println("POST to $url: $data")

            val request = Request(Method.POST, url)
                .bearerAuth(bearerToken)
                .contentType(ContentType.APPLICATION_JSON)
                .body(data)

            val response = httpClient(request)

            println("Resourcefully responds ${response.status} ${response.bodyString()}")

            try {
                val export = CocoKotlinxSerialization.json.decodeFromString<ResourcefullyExport>(data)

                storage.save(
                    organization = export.organizationName,
                    name = export.personName,
                    email = export.email
                )
                println("Stored Resourcefully request from: ${export.email}")
            } catch (e: Exception) {
                println("Error storing Resourcefully request: ${e.message}")
            }

            // return upstream response
            response
        }
    )
}
