import {FormEvent, FunctionComponent} from "react"
import {Card, RadioGroup} from "@radix-ui/themes"
import {SolarFarm, PVOrientation } from "local4local"
import {CostSection} from "../cost/cost-section.tsx"
import {costFromFormData} from "../cost/cost-from-form-data.ts"
import {SolarFarmHeading} from "./solarfarm-heading.tsx"
import {LabelWithInfo} from "../info/label-with-info.tsx"
import {solarFarmTitles, titles} from "../info/titles.tsx"
import {AssetButtonRow} from "../assets/AssetButtonRow.tsx"

export const SolarFarmForm: FunctionComponent<{
    initialData?: SolarFarm | null
    save: (solarFarm: SolarFarm) => void
    hide: () => void
}> = ({initialData = new SolarFarm, save, hide}) => {
    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const form = event.currentTarget
        const formData = new FormData(form)
        
        const dataOrientation: { [key: string]: PVOrientation } = {
            SOUTH: PVOrientation.SOUTH,
            EAST_WEST: PVOrientation.EAST_WEST,
        }
        
        const orientation = formData.get("orientation") as string;
        const pvOrientation: PVOrientation = dataOrientation[orientation];

        const solarFarm = new SolarFarm(
            parseFloat(formData.get("nominalPower_kW") as string),
            pvOrientation,
            costFromFormData(formData),
            formData.get("curtailment") === "on",
        )
        save(solarFarm)
        hide()
    }

    return (
        <Card className="form-box">
            <SolarFarmHeading/>
            <form onSubmit={onSubmit}>
                <div className="radix-grid">
                    <LabelWithInfo data={solarFarmTitles["nominalPower_kW"]} />
                    <input
                        className="form-input"
                        type="number"
                        id="nominalPower_kW"
                        name="nominalPower_kW"
                        defaultValue={initialData?.nominalPower_kW}
                        max={10_000}
                    />
                </div>
                <div className="radix-grid">
                    <LabelWithInfo data={solarFarmTitles.curtailment} />
                    <input type="checkbox" id="curtailment" name="curtailment" defaultChecked={initialData?.curtailment} />
                </div>
                <div className="radix-grid">
                    <LabelWithInfo data={titles.orientation} />
                </div>
                <div>
                    <RadioGroup.Root name="orientation" defaultValue={initialData?.orientation.name.toString() || PVOrientation.SOUTH.toString()}>
                        <label>
                            <input type="radio" name="orientation" value={PVOrientation.SOUTH.name} defaultChecked={initialData?.orientation === PVOrientation.SOUTH} />
                            {PVOrientation.SOUTH.displayName}
                        </label>
                        <label>
                            <input type="radio" name="orientation" value={PVOrientation.EAST_WEST.name} defaultChecked={initialData?.orientation === PVOrientation.EAST_WEST} />
                            {PVOrientation.EAST_WEST.displayName}
                        </label>
                    </RadioGroup.Root>
                </div>
                <CostSection initialData={ initialData?.cost } />
                <AssetButtonRow onClickCancel={hide} />
            </form>
        </Card>
    )
}
