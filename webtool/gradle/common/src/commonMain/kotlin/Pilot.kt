package nu.local4local.common

import kotlinx.serialization.Serializable
import kotlinx.serialization.json.Json
import kotlin.js.JsExport
import kotlin.js.JsName
import kotlin.js.JsStatic
import kotlin.math.roundToInt

var idCounter = 1

@JsExport
@Serializable
data class Pilot(
    val name: String,
    val householdGroups: List<HouseholdGroup> = emptyList(),
    val companies: List<Company> = emptyList(),
    val solarFarms: List<SolarFarm> = emptyList(),
    val windFarms: List<WindFarm> = emptyList(),
    val batteries: List<Battery> = emptyList(),
    val heatStorages: List<HeatStorage> = emptyList(),
    val biogasGenerators: List<BiogasGenerator> = emptyList(),
    val supplierCost: SupplierCost = SupplierCost(),
) {
    @Deprecated("Moved to supplierCost.bufferPrice_eurpkWh", ReplaceWith("supplierCost.bufferPrice_eurpkWh"))
    val bufferPrice_eurpkWh
        get() = supplierCost.bufferPrice_eurpkWh

    fun hasGenerationAssets() = solarFarms.isNotEmpty() || windFarms.isNotEmpty() || biogasGenerators.isNotEmpty()

    fun addHouseHoldGroup(householdGroup: HouseholdGroup) = copy(householdGroups = householdGroups + householdGroup)
    fun addCompany(company: Company) = copy(companies = companies + company)
    fun addSolarFarm(solarFarm: SolarFarm) = copy(solarFarms = solarFarms + solarFarm)
    fun addWindFarm(windFarm: WindFarm) = copy(windFarms = windFarms + windFarm)
    fun addBattery(battery: Battery) = copy(batteries = batteries + battery)
    fun addHeatStorage(heatStorage: HeatStorage) = copy(heatStorages = heatStorages + heatStorage)
    fun addBiogasGenerator(biogasGenerator: BiogasGenerator) = copy(biogasGenerators = biogasGenerators + biogasGenerator)

    fun removeHouseholdGroup(householdGroup: HouseholdGroup) = copy(householdGroups = this.householdGroups - householdGroup)
    fun removeCompany(company: Company) = copy(companies = companies - company)
    fun removeSolarFarm(solarFarm: SolarFarm) = copy(solarFarms = this.solarFarms - solarFarm)
    fun removeWindFarm(windFarm: WindFarm) = copy(windFarms = this.windFarms - windFarm)
    fun removeBattery(battery: Battery) = copy(batteries = this.batteries - battery)
    fun removeHeatStorage(heatStorage: HeatStorage) = copy(heatStorages = this.heatStorages - heatStorage)
    fun removeBiogasGenerator(biogasGenerator: BiogasGenerator) = copy(biogasGenerators = this.biogasGenerators - biogasGenerator)

    fun replaceHouseholdGroup(householdGroup: HouseholdGroup, index: Int) = copy(householdGroups = householdGroups.replaceAt(index, householdGroup))
    fun replaceSolarFarm(solarFarm: SolarFarm, index: Int) = copy(solarFarms = solarFarms.replaceAt(index, solarFarm))
    fun replaceWindFarm(windFarm: WindFarm, index: Int) = copy(windFarms = windFarms.replaceAt(index, windFarm))
    fun replaceBattery(battery: Battery, index: Int) = copy(batteries = batteries.replaceAt(index, battery))
    fun replaceHeatStorage(heatStorage: HeatStorage, index: Int) = copy(heatStorages = heatStorages.replaceAt(index, heatStorage))
    fun replaceBiogasGenerator(biogasGenerator: BiogasGenerator, index: Int) = copy(biogasGenerators = biogasGenerators.replaceAt(index, biogasGenerator))

    fun replaceCompany(old: Company, new: Company) = copy(companies = companies.replace(old, new))

    fun replaceSolarFarmByRef(old: SolarFarm, new: SolarFarm) = copy(solarFarms = solarFarms.replace(old, new))
    fun replaceWindFarmByRef(old: WindFarm, new: WindFarm) = copy(windFarms = windFarms.replace(old, new))
    fun replaceBiogasGeneratorByRef(old: BiogasGenerator, new: BiogasGenerator) = copy(biogasGenerators = biogasGenerators.replace(old, new))

    // Extension function for List replacement
    private fun <T> List<T>.replaceAt(index: Int, newValue: T): List<T> {
        return toMutableList().apply { this[index] = newValue }
    }

    private fun <T> List<T>.replace(oldValue: T, newValue: T): List<T> =
        map { if (it == oldValue) newValue else it }

    fun withSupplierCost(supplierCost: SupplierCost) = copy(supplierCost = supplierCost)

    fun toJson(): String =
        Json.encodeToString(this)

    fun hasFixedPriceAssets() = this.getFixedPriceWindFarms().isNotEmpty()
            || this.getFixedPriceSolarFarms().isNotEmpty()
            || this.getFixedPriceBiogasGenerators().isNotEmpty()

    fun getFixedPriceWindFarms() = windFarms.filter {
        it.cost.ppaType == PPAType.FIXED_PRICE_PPA
    }

    fun getFixedPriceSolarFarms() = solarFarms.filter {
        it.cost.ppaType == PPAType.FIXED_PRICE_PPA
    }

    fun getFixedPriceBiogasGenerators() = biogasGenerators.filter {
        it.cost.ppaType == PPAType.FIXED_PRICE_PPA
    }
}

@JsExport
fun pilotFromJson(json: String) = Json.decodeFromString<Pilot>(json)

@JsExport
fun createDefaultStartPilot() = Pilot(
    name = "start",
    householdGroups = listOf(
        HouseholdGroup(),
    )
)

@JsExport
@Serializable
data class SupplierCost (
    val bufferPrice_eurpkWh: Double = 0.01,
    val onbalansMarkup_r: Double = 0.2,
    val feedInCompensation_eurpkWh: Double = 0.00,
)

@JsExport
@Serializable
enum class PPAType(val displayName: String) {
    FIXED_PRICE_PPA("Fixed price PPA"),
    FLOOR_CAP_PPA("Floor-cap PPA"),
}

@JsExport
@Serializable
data class AssetCost(
    val ppaType: PPAType = PPAType.FIXED_PRICE_PPA,
    val sdeAanvraagbedrag_eurpkWh: Double? = 0.0,
    val sdeBasisenergieprijs_eurpkWh: Double? = 0.0,
    val LCOE_eurpkWH: Double? = 0.0,
    val CAPEX_eur: Double? = 0.0,
    val interest_r: Double? = 0.0,
    val depreciationPeriod_y: Double? = 0.0,
    val OPEX_eurpy: Double? = 0.0,
) {
    companion object {
        @JsStatic
        fun createForGenerationAsset(): AssetCost = AssetCost(
            sdeAanvraagbedrag_eurpkWh = 0.10,
            sdeBasisenergieprijs_eurpkWh = 0.04,
        )
    }
}

@JsExport
@Serializable
data class HouseholdGroup(
    val type: String = "Huishoudens",
    val households_n: Int = 400,
    val hasPV_r: Double = .3,
    val hasHeatPump_r: Double = .1,
    val hasChargePoint_r: Double = .2,
    val hasHomeBattery_r: Double = 0.0,
     /**Jaarlijks gemiddeld basisverbruik zonder warmtepomp, elektrische voertuigen en zonnepanelen */
    val annualBaseConsumptionAvg_kWh: Double = 3000.0,
    val id: String = "HouseholdGroup_${idCounter++}"
) {
    fun hasPV_n() = (hasPV_r * households_n).roundToInt()
    fun hasHeatPump_n() = (hasHeatPump_r * households_n).roundToInt()
    fun hasChargePoint_n() = (hasChargePoint_r * households_n).roundToInt()
    fun hasHomeBattery_n() = (hasHomeBattery_r * households_n).roundToInt()
}

@JsExport
@Serializable
data class Company(
    val name: String = "",
    val annualElectricityConsumption_kWh: Double = 100_000.0,
    val pvInstalled_kWp: Double = 50.0,
    val id: String = "Company_${idCounter++}"
    // disabled for now
//    val chargePoints_n: Int,
)

/*

@JsExport
data class Utility(
    val name: String,
    val type: String,
)


@JsExport
data class ConsumptionAsset(
    val consumptionType: String,
    val consumption_kW: Double,
    val yearlyConsumption_kWh: Double,
)
*/

@JsExport
@Serializable
enum class PVOrientation(val displayName: String) {
    SOUTH("Zuid"),
    EAST_WEST("Oost-west"),
}

@JsExport
@Serializable
data class SolarFarm(
    val nominalPower_kW: Double = 1000.0,
    val orientation: PVOrientation = PVOrientation.SOUTH,
    val cost: AssetCost = AssetCost.createForGenerationAsset(),
    val curtailment: Boolean = false,
    val id: String = "SolarFarm_${idCounter++}",
) {
    fun withSdeAanvraagbedrag_eurpkWh(sdeAanvraagbedrag_eurpkWh: Double) = copy(
        cost = cost.copy(
            sdeAanvraagbedrag_eurpkWh = sdeAanvraagbedrag_eurpkWh
        )
    )

    fun withSdeBasisenergieprijs_eurpkWh(sdeBasisenergieprijs_eurpkWh: Double) = copy(
        cost = cost.copy(
            sdeBasisenergieprijs_eurpkWh = sdeBasisenergieprijs_eurpkWh
        )
    )
}

@JsExport
@Serializable
data class BiogasGenerator(
    val power_kW: Double,
    val cost: AssetCost,
    val curtailment: Boolean = false,
    val id: String = "BiogasGenerator_${idCounter++}"
) {
    fun withSdeAanvraagbedrag_eurpkWh(sdeAanvraagbedrag_eurpkWh: Double) = copy(
        cost = cost.copy(
            sdeAanvraagbedrag_eurpkWh = sdeAanvraagbedrag_eurpkWh
        )
    )

    fun withSdeBasisenergieprijs_eurpkWh(withSdeBasisenergieprijs_eurpkWh: Double) = copy(
        cost = cost.copy(
            sdeBasisenergieprijs_eurpkWh = withSdeBasisenergieprijs_eurpkWh
        )
    )
}

@JsExport
@Serializable
data class WindFarm(
    val nominalPower_kW: Double,
    val cost: AssetCost,
    val location: WindFarmLocation = WindFarmLocation.BETUWE,
    val curtailment: Boolean = false,
    val id: String = "WindFarm_${idCounter++}"
) {
    fun withSdeAanvraagbedrag_eurpkWh(sdeAanvraagbedrag_eurpkWh: Double) = copy(
        cost = cost.copy(
            sdeAanvraagbedrag_eurpkWh = sdeAanvraagbedrag_eurpkWh
        )
    )

    fun withSdeBasisenergieprijs_eurpkWh(withSdeBasisenergieprijs_eurpkWh: Double) = copy(
        cost = cost.copy(
            sdeBasisenergieprijs_eurpkWh = withSdeBasisenergieprijs_eurpkWh
        )
    )
}

@JsExport
@Serializable
enum class WindFarmLocation(val displayName: String) {
    HOEK_VAN_HOLLAND("Hoek van Holland"),
    MIDDEN_LIMBURG("Midden-Limburg"),
    BETUWE("Betuwe"),
}

@JsExport
@Serializable
data class Battery(
    val capacity_kWh: Double = 2000.0,
    val peakPower_kW: Double = 1000.0,
    val cost: AssetCost = AssetCost(
        CAPEX_eur = 400_000.0,
        interest_r = 0.06,
        depreciationPeriod_y = 15.0,
        OPEX_eurpy = 8000.0,
    ),
    val id: String = "Battery_${idCounter++}"
)

@JsExport
@Serializable
data class HeatStorage(
    val storageMedium: String,
    val storageVolume_m3: Double,
    val minTemp_degC: Double,
    val maxTemp_degC: Double,
    val cost: AssetCost,
    val id: String = "HeatStorage_${idCounter++}"
) {
    fun getCapacity_kWh(): Double {
        val specificHeatCapacity = 4.18 // kJ/kg/K

        return storageVolume_m3 * 1000 * specificHeatCapacity * (minTemp_degC - maxTemp_degC) / 3600
    }
}
