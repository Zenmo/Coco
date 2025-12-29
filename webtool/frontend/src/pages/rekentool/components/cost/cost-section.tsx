import {FunctionComponent, useState} from "react"
import { DataList, Heading } from "@radix-ui/themes"
import { PiMoneyWavyLight } from "react-icons/pi"
import { AssetCost, PPAType } from "local4local"
import {titles} from "../info/titles.tsx"
import {DivWithInfo, LabelWithInfo} from "../info/label-with-info.tsx"
import {PPARadios} from "./p-p-a-radios.tsx"
import {SdeAanvraagBedragFormRow, SdeBasisenergiePrijsFormRow} from "./SdeForm.tsx"

export const CostDisplay: FunctionComponent<{
    cost: AssetCost,
    showCostPerKwh?: boolean,
    showTotalCostFactors?: boolean
}> = ({
    cost,
    showCostPerKwh = true,
    showTotalCostFactors = false,
}) => {
    return (
        <div>
            <CostHeading />
            <DataList.Root style={{gridTemplateColumns: "2fr 1fr"}}>
                {showCostPerKwh && (
                    <>
                        <DataList.Item>
                            <DataList.Label>
                                <DivWithInfo data={titles.ppaType} />
                            </DataList.Label>
                            <DataList.Value>{cost.ppaType.displayName}</DataList.Value>
                        </DataList.Item>
                        {cost.ppaType === PPAType.FIXED_PRICE_PPA ?
                            <DataList.Item>
                                <DataList.Label>
                                    <DivWithInfo data={titles["LCOE_eurpkWh"]} />
                                </DataList.Label>
                                <DataList.Value>{cost.LCOE_eurpkWH}</DataList.Value>
                            </DataList.Item>
                            : null}
                        {cost.ppaType === PPAType.FLOOR_CAP_PPA ?
                            <>
                                <DataList.Item>
                                    <DataList.Label>
                                        <DivWithInfo data={titles["sdeAanvraagbedrag_eurpkWh"]} />
                                    </DataList.Label>
                                    <DataList.Value>{cost.sdeAanvraagbedrag_eurpkWh}</DataList.Value>
                                </DataList.Item>
                                <DataList.Item>
                                    <DataList.Label>
                                        <DivWithInfo data={titles["sdeBasisenergieprijs_eurpkWh"]} />
                                    </DataList.Label>
                                    <DataList.Value>{cost.sdeBasisenergieprijs_eurpkWh}</DataList.Value>
                                </DataList.Item>
                            </>
                        : null}
                    </>
                )}
                {showTotalCostFactors &&
                    <>
                        <DataList.Item>
                            <DataList.Label>
                                <DivWithInfo data={titles["CAPEX_eur"]} />
                            </DataList.Label>
                            <DataList.Value>{cost.CAPEX_eur}</DataList.Value>
                        </DataList.Item>
                        <DataList.Item>
                            <DataList.Label>
                                <DivWithInfo data={titles["interest_r"]} />
                            </DataList.Label>
                            <DataList.Value>{(cost.interest_r || 0) * 100}</DataList.Value>
                        </DataList.Item>
                        <DataList.Item>
                            <DataList.Label>
                                <DivWithInfo data={titles["depreciationPeriod_y"]} />
                            </DataList.Label>
                            <DataList.Value>{cost.depreciationPeriod_y}</DataList.Value>
                        </DataList.Item>
                        <DataList.Item>
                            <DataList.Label>
                                <DivWithInfo data={titles["OPEX_eurpy"]} />
                            </DataList.Label>
                            <DataList.Value>{cost.OPEX_eurpy}</DataList.Value>
                        </DataList.Item>
                    </>
                }
            </DataList.Root>
        </div>
    )
}

const CostHeading = () => (
    <Heading as="h3" style={{paddingBottom: ".5rem", paddingTop: ".5rem"}}>
        <PiMoneyWavyLight />
        &nbsp;
        Kosten
    </Heading>
);

const defaultGenerationCost = AssetCost.createForGenerationAsset()

export const CostSection: FunctionComponent<{
    showCostPerKwh?: boolean
    showTotalCostFactors?: boolean
    initialData?: AssetCost | null
}> = ({
    showCostPerKwh = true,
    showTotalCostFactors = false,
    initialData
}) => {
    const [ppaType, setPpaType] = useState(initialData?.ppaType)
    return (
        <>
            <CostHeading />
            {showCostPerKwh && (
                <>
                    <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        paddingTop: ".5rem",
                    }}>
                        <LabelWithInfo data={titles.ppaType} />
                        <PPARadios initialValue={initialData?.ppaType} onChange={setPpaType} />
                    </div>
                    {ppaType === PPAType.FIXED_PRICE_PPA ?
                        <div className="radix-grid">
                            <LabelWithInfo data={titles["LCOE_eurpkWh"]} />
                            <input className="form-input" type="number" id="LCOE_eurpkWh" name="LCOE_eurpkWh"
                                   min={0} step={0.001}
                                   placeholder="€/kWh"
                                   defaultValue={initialData?.LCOE_eurpkWH || defaultGenerationCost.LCOE_eurpkWH || ""}
                            />
                        </div>
                        : null}
                    {ppaType === PPAType.FLOOR_CAP_PPA ?
                        <>
                            <SdeAanvraagBedragFormRow
                                defaultValue={initialData?.sdeAanvraagbedrag_eurpkWh || defaultGenerationCost.sdeAanvraagbedrag_eurpkWh || ""} />
                            <SdeBasisenergiePrijsFormRow
                                defaultValue={initialData?.sdeBasisenergieprijs_eurpkWh || defaultGenerationCost.sdeBasisenergieprijs_eurpkWh || ""} />
                        </>
                        : null}
                </>
            )}

            {showTotalCostFactors &&
                <>
                    <div className="radix-grid">
                        <LabelWithInfo data={titles["CAPEX_eur"]} />
                        <input className="form-input" type="number" id="CAPEX_eur" name="CAPEX_eur" min={0} step={0.001}
                               placeholder="€" defaultValue={initialData?.CAPEX_eur || 0} />
                    </div>
                    <div className="radix-grid">
                        <LabelWithInfo data={titles["interest_r"]} />
                        <input className="form-input" type="number" id="interest_r" name="interest_r" min={0} max={100} step={0.05}
                            placeholder="%" defaultValue={ (initialData?.interest_r || 0) * 100}/>
                    </div>
                    <div className="radix-grid">
                        <LabelWithInfo data={titles["depreciationPeriod_y"]} />
                        <input className="form-input" type="number" id="depreciationPeriod_y" name="depreciationPeriod_y" min={0} step={0.001}
                            placeholder="jaar" defaultValue={ initialData?.depreciationPeriod_y || 0 }/>
                    </div>
                    <div className="radix-grid">
                        <LabelWithInfo data={titles["OPEX_eurpy"]} />
                        <input className="form-input" type="number" id="OPEX_eurpy" name="OPEX_eurpy" min={0} step={0.001}
                            placeholder="€/jaar" defaultValue={ initialData?.OPEX_eurpy || 0 }/>
                    </div>
                </>
            }
        </>
    )
}
