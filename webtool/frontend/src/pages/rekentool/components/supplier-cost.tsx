import {FormEvent, FunctionComponent} from "react"
import {Button, Card, DataList, Flex, Heading} from "@radix-ui/themes"
import {CardMenu} from "./card-menu.tsx"
import {Pilot, SupplierCost as SupplierCostModel} from "local4local"
import {PiMoneyWavyLight} from "react-icons/pi"
import {DivWithInfo} from "./info/label-with-info.tsx"
import {titles} from "./info/titles.tsx"

export const SupplierCostCard: FunctionComponent<{
    pilot: Pilot,
    onChange: (pilot: Pilot) => void,
    isEditing: boolean,
    setIsEditing: (isEditing: boolean) => void,
}> = ({pilot, onChange, isEditing, setIsEditing}) => {
    if (isEditing) {
        return (
            <SupplierCostForm
                initialData={pilot.supplierCost}
                save={(supplierCost: SupplierCostModel) => onChange(pilot.withSupplierCost(supplierCost))}
                hide={() => setIsEditing(false)}
            />
        )
    } else {
        return (
            <SupplierCostDisplay
                supplierCost={pilot.supplierCost}
                onEdit={() => setIsEditing(true)}
            />
        )
    }
}

const SupplierCostDisplay: FunctionComponent<{
    supplierCost: SupplierCostModel,
    onEdit: () => void,
}> = ({supplierCost, onEdit}) => {
    return (
        <Card>
            <Flex className="head-title">
                <SupplierCostHeading />
                <CardMenu onEdit={onEdit}/>
            </Flex>
            <DataList.Root style={{gridTemplateColumns: "3fr 1fr"}}>
                <DataList.Item>
                    <DataList.Label>
                        <DivWithInfo data={titles["bufferPrice_eurpkWh"]} />
                    </DataList.Label>
                    <DataList.Value>{(supplierCost.bufferPrice_eurpkWh * 100).toFixed(2)}</DataList.Value>
                </DataList.Item>
                <DataList.Item>
                    <DataList.Label>
                        <DivWithInfo data={titles["onbalansMarkup_r"]} />
                    </DataList.Label>
                    <DataList.Value>{supplierCost.onbalansMarkup_r * 100} %</DataList.Value>
                </DataList.Item>
                <DataList.Item>
                    <DataList.Label>
                        <DivWithInfo data={titles["feedInCompensation_eurpkWh"]} />
                    </DataList.Label>
                    <DataList.Value>{supplierCost.feedInCompensation_eurpkWh.toString()}</DataList.Value>
                </DataList.Item>
            </DataList.Root>
        </Card>
    )
}

const SupplierCostHeading = () => (
    <Heading as="h3" style={{paddingBottom: ".5rem"}}>
        <PiMoneyWavyLight />
        &nbsp;
        Leverancierskosten
    </Heading>
)

const SupplierCostForm: FunctionComponent<{
    initialData: SupplierCostModel;
    save: (supplierCost: SupplierCostModel) => void
    hide: () => void
}> = ({initialData, save, hide}) => {
    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const form = event.currentTarget
        const formData = new FormData(form)
        const supplierCost = new SupplierCostModel(
            (parseFloat(formData.get("bufferPrice_eurpkWh") as string) || 0) / 100,
            parseFloat(formData.get("onbalansMarkup_r") as string) * 0.01 || 0,
            parseFloat(formData.get("feedInCompensation_eurpkWh") as string) || 0,
        )
        save(supplierCost)
        hide()
    }

    return (
        <Card className="form-box">
            <SupplierCostHeading/>
            <form onSubmit={onSubmit}>
                <div className="radix-grid">
                    <label className="form-label" htmlFor="bufferPrice_eurpkWh">Leveranciersopslag [ct/kWh]</label>
                    <input className="form-input"
                           type="number"
                           id="bufferPrice_eurpkWh"
                           name="bufferPrice_eurpkWh"
                           placeholder="ct/kWh"
                           required
                           defaultValue={initialData.bufferPrice_eurpkWh * 100}
                           min={0}
                           step={0.01}/>
                </div>
                <div className="radix-grid">
                    <label className="form-label" htmlFor="onbalansMarkup_r">Opslag onbalans [%]</label>
                    <input className="form-input"
                           type="number"
                           id="onbalansMarkup_r"
                           name="onbalansMarkup_r"
                           placeholder="%"
                           required
                           defaultValue={initialData.onbalansMarkup_r * 100}
                           min={0}
                           step={0.1}/>
                </div>
                <div className="radix-grid">
                    <label className="form-label" htmlFor="feedInCompensation_eurpkWh">Terugleververgoeding [€/kWh]</label>
                    <input className="form-input"
                           type="number"
                           id="feedInCompensation_eurpkWh"
                           name="feedInCompensation_eurpkWh"
                           placeholder="€/kWh"
                           required
                           defaultValue={initialData.feedInCompensation_eurpkWh}
                           min={0}
                           step={0.001}/>
                </div>
                <Button type="button" onClick={hide} style={{marginRight: '10px'}} highContrast variant="soft">Annuleren</Button>
                <Button type="submit">Opslaan</Button>
            </form>
        </Card>
    )
}
