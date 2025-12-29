import {FunctionComponent} from "react"
import {Flex, Card, DataList} from "@radix-ui/themes"
import {HeatStorage} from "local4local"
import {HeatStorageHeading} from "./heat-storage-heading.tsx"
import {CostDisplay} from "../cost/cost-section.tsx"
import {CardMenu} from "../card-menu.tsx"
import {DivWithInfo} from "../info/label-with-info.tsx"
import { titles } from '../info/titles.tsx';

export const HeatStorageDisplay: FunctionComponent<{
        heatStorage: HeatStorage,
        onEdit: () => void,
        toDelete: () => void,
    }> = ({heatStorage, onEdit, toDelete}) => {
    return (
        <Card>
            <Flex className="head-title">
                <HeatStorageHeading />
                <CardMenu onDelete={toDelete} onEdit={onEdit}/>
            </Flex>
            <DataList.Root style={{gridTemplateColumns: "2fr 1fr"}}>
                <DataList.Item>
                    <DataList.Label><DivWithInfo data={titles["storageMedium"]} /></DataList.Label>
                    <DataList.Value>{heatStorage.storageMedium}</DataList.Value>
                </DataList.Item>
                <DataList.Item>
                    <DataList.Label><DivWithInfo data={titles["storageVolume_m3"]} /></DataList.Label>
                    <DataList.Value>{heatStorage.storageVolume_m3} m3</DataList.Value>
                </DataList.Item>
                <DataList.Item>
                    <DataList.Label><DivWithInfo data={titles["minTemp_degC"]} /></DataList.Label>
                    <DataList.Value>{heatStorage.minTemp_degC} &deg;C</DataList.Value>
                </DataList.Item>
                <DataList.Item>
                    <DataList.Label><DivWithInfo data={titles["maxTemp_degC"]} /></DataList.Label>
                    <DataList.Value>{heatStorage.maxTemp_degC} &deg;C</DataList.Value>
                </DataList.Item>
            </DataList.Root>
            <CostDisplay cost={heatStorage.cost} />
        </Card>
    )
}
