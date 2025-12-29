import {FormEvent, FunctionComponent, useState} from "react"
import {Flex, Card, DataList, Heading} from "@radix-ui/themes"
import {Pilot, WindFarm, WindFarmLocation, AssetCost} from "local4local"
import { GiWindTurbine } from "react-icons/gi";
import {CostSection, CostDisplay} from "../cost/cost-section.tsx"
import {CardMenu} from "../card-menu.tsx"
import {costFromFormData} from "../cost/cost-from-form-data.ts"
import {DivWithInfo, LabelWithInfo} from "../info/label-with-info.tsx"
import {windFarmTitles} from "../info/titles.tsx"
import {LocationRadioButtons} from "./location-radio-buttons.tsx"
import {AssetButtonRow} from "../assets/AssetButtonRow.tsx"

export const WindFarmDisplay: FunctionComponent<{
    windFarm: WindFarm,
    onEdit: () => void,
    toDelete: () => void,
}> = ({windFarm, onEdit, toDelete}) => {
    return (
        <Card>
             <Flex className="head-title">
                <WindFarmHeading/>
                <CardMenu onDelete={toDelete} onEdit={onEdit}/>
            </Flex>
            <DataList.Root style={{gridTemplateColumns: "2fr 1fr"}}>
                <DataList.Item>
                    <DataList.Label><DivWithInfo data={windFarmTitles.nominalPower_kW} /></DataList.Label>
                    <DataList.Value>{windFarm.nominalPower_kW} kW</DataList.Value>
                </DataList.Item>
                <DataList.Item>
                    <DataList.Label><DivWithInfo data={windFarmTitles.location} /></DataList.Label>
                    <DataList.Value>{windFarm.location.displayName}</DataList.Value>
                </DataList.Item>
                <DataList.Item>
                    <DataList.Label><DivWithInfo data={windFarmTitles.curtailment} /></DataList.Label>
                    <DataList.Value>{windFarm.curtailment ? "Ja" : "Nee"}</DataList.Value>
                </DataList.Item>
            </DataList.Root>
            <CostDisplay cost={windFarm.cost} />
        </Card>
    )
}

export const WindFarmHeading = () => (
    <Heading as="h3" style={{paddingBottom: ".5rem"}}>
        <GiWindTurbine />
        &nbsp;
        Windpark
    </Heading>
)

export const WindFarmForm: FunctionComponent<{
    initialData?: WindFarm | null;
    save: (s: WindFarm) => void
    hide: () => void
}> = ({initialData, save, hide}) => {
    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget
        const formData = new FormData(form);

        const windFarm = new WindFarm(
            parseFloat(formData.get("nominalPower_kW") as string),
            costFromFormData(formData),
            WindFarmLocation.valueOf(formData.get("location") as string),
            formData.get("curtailment") === "on",
        );

        save(windFarm)
        hide()
    }

    return (
        <Card className="form-box">
            <WindFarmHeading/>
            <form onSubmit={onSubmit}>
                <div className="radix-grid">
                    <LabelWithInfo data={windFarmTitles.nominalPower_kW} />
                    <input
                        className="form-input"
                        type="number"
                        id="nominalPower_kW"
                        name="nominalPower_kW"
                        defaultValue={initialData?.nominalPower_kW || 2000}
                        max={50_000}
                    />
                </div>
                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    paddingTop: ".5rem",
                }}>
                    <LabelWithInfo data={windFarmTitles.location} />
                    <LocationRadioButtons initialValue={initialData?.location} />
                </div>
                <div className="radix-grid">
                    <LabelWithInfo data={windFarmTitles.curtailment} />
                    <input type="checkbox" id="curtailment" name="curtailment" defaultChecked={initialData?.curtailment} />
                </div>
                <CostSection initialData={initialData?.cost ?? AssetCost.createForGenerationAsset()}/>
                <AssetButtonRow onClickCancel={hide} />
            </form>
        </Card>
    )
}

export const WindFarmsDisplayEdit: FunctionComponent<{
    pilot: Pilot,
    onChange: (pilot: Pilot) => void,
}> = ({pilot, onChange}) => {
    const [selected, setSelected] = useState<WindFarm | null>(null);

    return (
        <>
            {pilot.windFarms.asJsReadonlyArrayView().map((it, i) =>
                selected == it ? (
                    <WindFarmForm
                        key={"WindFarm_" + i}
                        save={(asset: WindFarm) => {
                            onChange(pilot.replaceWindFarm(asset, i))
                            setSelected(null);
                        }}
                        hide={() => {
                            setSelected(null);
                        }}
                        initialData={selected}
                    />
                ) : (
                    <WindFarmDisplay
                        key={"WindFarm_" + i}
                        windFarm={it}
                        onEdit={() => { setSelected(it)}}
                        toDelete={() => onChange(pilot.removeWindFarm(it))}
                    />
                )
            )}
        </>
    )
}
