import {ComponentProps, FunctionComponent, useState} from "react"
import {Battery, Company, HeatStorage, HouseholdGroup, Pilot, SolarFarm, WindFarm} from "local4local"
import {HouseholdForm} from "./household/household-form.tsx"
import {AddDropdown} from "./add-dropdown.tsx"
import {Button, Flex, Grid} from "@radix-ui/themes"
import {SolarFarmForm} from "./solarfarm/solarfarm-form.tsx"
import {BatteriesDisplayEdit, BatteryForm} from "./assets/battery.tsx"
import {BiogasGeneratorForm, BiogasGeneratorsDisplayEdit} from "./assets/biogas-generator.tsx"
import {WindFarmForm, WindFarmsDisplayEdit} from "./wind-farm/wind-farm.tsx"
import {HeatStorageForm} from "./heat-storage/heat-storage-form.tsx"
import {SupplierCostCard} from "./supplier-cost.tsx"
import {HouseholdsDisplayEdit} from "./household/households-display-edit.tsx"
import {SolarFarmsDisplayEdit} from "./solarfarm/solarfarms-display-edit.tsx"
import {HeatStoragesDisplayEdit} from "./heat-storage/heat-storage-display-edit.tsx"
import {CompanyDisplayEdit} from "./company/company-display-edit.tsx"
import {CompanyForm} from "./company/company-form.tsx"
import {SaveButton} from "./save.tsx"
import {PlayIcon} from "@radix-ui/react-icons"
import {local4localDarkOrange} from "../../../colors.ts"
import {Local4LocalButton} from "../../../shared-components/buttons/Local4LocalButton.tsx"

export const PlayButton: FunctionComponent<ComponentProps<typeof Button>> = (props) => (
    <Local4LocalButton {...props} style={{backgroundColor: local4localDarkOrange}}>
        <PlayIcon style={{width: "1.2rem", height: "1.2rem"}}/>
        Simuleren
    </Local4LocalButton>
)

export const Configure: FunctionComponent<{
    pilot: Pilot,
    onChange: (pilot: Pilot) => void,
    showStartButton: boolean,
    onClickStart: () => void,
}> = ({pilot, onChange, onClickStart, showStartButton, ...props}) => {
    const [showAddHouseholdGroup, setShowAddHouseholdGroup] = useState(false)
    const [showAddCompany, setShowAddCompany] = useState(false)
    const [showAddSolarFarm, setShowAddSolarFarm] = useState(false)
    const [showAddWindFarm, setShowAddWindFarm] = useState(false)
    const [showAddBiogasGenerator, setShowAddBiogasGenerator] = useState(false)
    const [showAddBattery, setShowAddBattery] = useState(false)
    const [showAddHeatStorage, setShowAddHeatStorage] = useState(false)
    const [showEditSupplierCost, setShowEditSupplierCost] = useState(false)
    const simulationShowing = !showStartButton

    const showButtons = !(
        showAddHouseholdGroup ||
        showAddCompany ||
        showAddSolarFarm ||
        showAddWindFarm ||
        showAddBiogasGenerator ||
        showAddBattery ||
        showAddHeatStorage ||
        showEditSupplierCost
    )

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "1rem",
            }}
        >
            <Grid gap="2" {...props} columns={simulationShowing ? "1" : "3"}>

                <SupplierCostCard
                    pilot={pilot}
                    onChange={onChange}
                    isEditing={showEditSupplierCost}
                    setIsEditing={setShowEditSupplierCost}
                />

                <HouseholdsDisplayEdit pilot={pilot} onChange={onChange}/>
                <CompanyDisplayEdit pilot={pilot} onChange={onChange}/>
                <SolarFarmsDisplayEdit pilot={pilot} onChange={onChange}/>
                <WindFarmsDisplayEdit pilot={pilot} onChange={onChange}/>
                <BiogasGeneratorsDisplayEdit pilot={pilot} onChange={onChange}/>
                <BatteriesDisplayEdit pilot={pilot} onChange={onChange}/>
                <HeatStoragesDisplayEdit pilot={pilot} onChange={onChange}/>

                {showAddHouseholdGroup &&
                    <HouseholdForm save={(asset: HouseholdGroup) => onChange(pilot.addHouseHoldGroup(asset))}
                                   hide={() => setShowAddHouseholdGroup(false)}/>}
                {showAddCompany &&
                    <CompanyForm save={(company: Company) => onChange(pilot.addCompany(company))}
                                 hide={() => setShowAddCompany(false)}/>}
                {showAddSolarFarm &&
                    <SolarFarmForm save={(asset: SolarFarm) => onChange(pilot.addSolarFarm(asset))}
                                   hide={() => setShowAddSolarFarm(false)}/>}
                {showAddWindFarm &&
                    <WindFarmForm save={(asset: WindFarm) => onChange(pilot.addWindFarm(asset))}
                                  hide={() => setShowAddWindFarm(false)}/>}
                {showAddBiogasGenerator &&
                    <BiogasGeneratorForm save={(asset) => onChange(pilot.addBiogasGenerator(asset))}
                                         hide={() => setShowAddBiogasGenerator(false)}/>}
                {showAddBattery &&
                    <BatteryForm save={(asset: Battery) => onChange(pilot.addBattery(asset))}
                                 hide={() => setShowAddBattery(false)}/>}
                {showAddHeatStorage &&
                    <HeatStorageForm save={(asset: HeatStorage) => onChange(pilot.addHeatStorage(asset))}
                                     hide={() => setShowAddHeatStorage(false)}/>}

            </Grid>
            {showButtons &&
                <Flex gap=".5rem" justify="center">
                    <SaveButton pilot={pilot}/>
                    <AddDropdown
                        addHouseholdGroup={() => setShowAddHouseholdGroup(true)}
                        addCompany={() => setShowAddCompany(true)}
                        addSolarFarm={() => setShowAddSolarFarm(true)}
                        addWindFarm={() => setShowAddWindFarm(true)}
                        addBattery={() => setShowAddBattery(true)}
                        addHeatStorage={() => setShowAddHeatStorage(true)}
                        addBiogasGenerator={() => setShowAddBiogasGenerator(true)}
                        disableAddBattery={pilot.batteries.asJsReadonlyArrayView().length > 0}
                    />
                    {showStartButton && <PlayButton onClick={onClickStart}/>}
                </Flex>
            }
        </div>
    )
}
