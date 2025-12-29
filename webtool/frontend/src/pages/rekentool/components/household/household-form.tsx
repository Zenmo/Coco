import {FormEvent, FunctionComponent} from "react"
import {HouseholdGroup} from "local4local"
import {Card} from "@radix-ui/themes"
import {HouseholdHeading} from "./household-heading.tsx"
import {LabelWithInfo} from "../info/label-with-info.tsx"
import { titles } from '../info/titles.tsx';
import {AssetButtonRow} from "../assets/AssetButtonRow.tsx"

export const HouseholdForm: FunctionComponent<{
    initialData?: HouseholdGroup,
    save: (householdGroup: HouseholdGroup) => void,
    hide: () => void,
}> = ({initialData = new HouseholdGroup, save, hide}) => {
    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const form = event.currentTarget
        const formData = new FormData(form);
        const householdGroup = new HouseholdGroup(
            formData.get("type") as string,
            parseInt(formData.get("households_n") as string),
            parseFloat(formData.get("hasPV_r") as string) * 0.01,
            parseFloat(formData.get("hasHeatPump_r") as string) * 0.01,
            parseFloat(formData.get("hasChargePoint_r") as string) * 0.01,
            parseFloat(formData.get("hasHomeBattery_r") as string) * 0.01,
            parseFloat(formData.get("annualBaseConsumptionAvg_kWh") as string),
        );
        save(householdGroup);
        hide();
    };

    return (
        <Card className="form-box">
            <HouseholdHeading />
            <form onSubmit={onSubmit}>
                <div className="radix-grid">
                    <LabelWithInfo data={titles["type"]} />
                    <input className="form-input" type="text" id="type" name="type" defaultValue={initialData.type} />
                </div>
                <div className="radix-grid">
                    <LabelWithInfo data={titles["households_n"]} />
                    <input
                        className="form-input"
                        type="number"
                        id="households_n"
                        name="households_n"
                        defaultValue={initialData.households_n} min={0}
                        max={10_000}
                    />
                </div>
                <div className="radix-grid">
                    <LabelWithInfo data={titles["hasPV_r"]} />
                    <input className="form-input" type="number" id="hasPV_r" name="hasPV_r" defaultValue={initialData.hasPV_r * 100} min={0} max={100} />
                </div>
                <div className="radix-grid">
                    <LabelWithInfo data={titles["hasHeatPump_r"]} />
                    <input className="form-input" type="number" id="hasHeatPump_r" name="hasHeatPump_r" defaultValue={initialData.hasHeatPump_r * 100} min={0} max={100} />
                </div>
                <div className="radix-grid">
                    <LabelWithInfo data={titles["hasChargePoint_r"]} />
                    <input className="form-input" type="number" id="hasChargePoint_r" name="hasChargePoint_r" defaultValue={initialData.hasChargePoint_r * 100} min={0} max={100} />
                </div>
                <div className="radix-grid">
                    <LabelWithInfo data={titles["hasHomeBattery_r"]} />
                    <input className="form-input" type="number" id="hasHomeBattery_r" name="hasHomeBattery_r" defaultValue={initialData.hasHomeBattery_r * 100} min={0} max={100} />
                </div>
                <div className="radix-grid">
                    <LabelWithInfo data={titles["annualBaseConsumptionAvg_kWh"]} />
                    <input
                        className="form-input"
                        type="number"
                        id="annualBaseConsumptionAvg_kWh"
                        name="annualBaseConsumptionAvg_kWh"
                        defaultValue={initialData.annualBaseConsumptionAvg_kWh}
                        min={0}
                        max={5000}
                    />
                </div>
                <AssetButtonRow onClickCancel={hide} />
            </form>
        </Card>
    )
}
