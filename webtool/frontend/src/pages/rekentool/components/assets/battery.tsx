import {FormEvent, FunctionComponent, useState} from "react"
import {Flex, Card, DataList, Heading} from "@radix-ui/themes"
import {Pilot, Battery} from "local4local"
import {PiCarBatteryLight} from "react-icons/pi"
import {CostSection, CostDisplay} from "../cost/cost-section.tsx"
import {CardMenu} from "../card-menu.tsx"
import {costFromFormData} from "../cost/cost-from-form-data.ts"
import {DivWithInfo, LabelWithInfo} from "../info/label-with-info.tsx"
import { titles } from '../info/titles.tsx';
import {AssetButtonRow} from "./AssetButtonRow.tsx"

export const BatteryDisplay: FunctionComponent<{
    battery: Battery,
    onEdit: () => void,
    toDelete: () => void,
}> = ({battery, onEdit, toDelete}) => {
    return (
        <Card>
            <Flex className="head-title">
                <BatteryHeading />
                <CardMenu onDelete={toDelete} onEdit={onEdit}/>
            </Flex>
            <DataList.Root style={{gridTemplateColumns: "2fr 1fr"}}>
                <DataList.Item>
                    <DataList.Label><DivWithInfo data={titles["capacity_kWh"]} /></DataList.Label>
                    <DataList.Value>{battery.capacity_kWh} kWh</DataList.Value>
                </DataList.Item>
                <DataList.Item>
                    <DataList.Label><DivWithInfo data={titles["peakPower_kW"]} /></DataList.Label>
                    <DataList.Value>{battery.peakPower_kW} kW</DataList.Value>
                </DataList.Item>
            </DataList.Root>
            <CostDisplay cost={battery.cost} showCostPerKwh={false} showTotalCostFactors={true} />
        </Card>
    )
}

const BatteryHeading = () => (
    <Heading as="h3" style={{paddingBottom: ".5rem"}}>
        <PiCarBatteryLight />
        &nbsp;
        Batterij
    </Heading>
)

export const BatteryForm: FunctionComponent<{
    initialData?: Battery | null;
    save: (save: Battery) => void
    hide: () => void
}> = ({initialData = new Battery, save, hide}) => {
    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const form = event.currentTarget
        const formData = new FormData(form);

        const battery = new Battery(
            parseFloat(formData.get("capacity_kWh") as string),
            parseFloat(formData.get("peakPower_kW") as string),
            costFromFormData(formData),
        )

        save(battery)
        hide()
    }

    return (
        <Card className="form-box">
            <BatteryHeading/>
            <form onSubmit={onSubmit}>
                <div className="radix-grid">
                    <LabelWithInfo data={titles["capacity_kWh"]} />
                    <input className="form-input" type="number" id="capacity_kWh" name="capacity_kWh" defaultValue={ initialData?.capacity_kWh } />
                </div>
                <div className="radix-grid">
                    <LabelWithInfo data={titles["peakPower_kW"]} />
                    <input className="form-input" type="number" id="peakPower_kW" name="peakPower_kW" defaultValue={ initialData?.peakPower_kW } />
                </div>
                <CostSection showCostPerKwh={false} showTotalCostFactors={true} initialData={initialData?.cost}/>
                <AssetButtonRow onClickCancel={hide} />
            </form>
        </Card>
    )
}

export const BatteriesDisplayEdit: FunctionComponent<{
    pilot: Pilot,
    onChange: (pilot: Pilot) => void,
}> = ({pilot, onChange}) => {
    const [selected, setSelected] = useState<Battery | null>(null);

    return (
        <>
            {pilot.batteries.asJsReadonlyArrayView().map((it, i) =>
                selected == it ? (
                    <BatteryForm
                        key={"Battery_" + i}
                        save={(asset: Battery) => {
                            onChange(pilot.replaceBattery(asset, i))
                            setSelected(null);
                        }}
                        hide={() => {
                            setSelected(null);
                        }}
                        initialData={selected}
                    />
                ) : (
                    <BatteryDisplay
                        key={"Battery_" + i}
                        battery={it}
                        onEdit={() => { setSelected(it)}}
                        toDelete={() => onChange(pilot.removeBattery(it))}
                    />
                )
            )}
        </>
    )
}
