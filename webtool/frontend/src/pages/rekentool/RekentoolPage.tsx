import {Configure, PlayButton} from "./components/configure.tsx"
import {ComponentProps, FunctionComponent, useEffect, useState} from "react"
import {savePilot} from "./services/save.ts"
import {startSimulation} from "./services/anylogic.ts"
import {Pilot} from "local4local"
import {Simulate} from "./components/simulate.tsx"
import {ResourcefullyDialog} from "./components/resourcefully/dialog.tsx"
import {useForceUpdate} from "./services/use-force-update.ts"
import {usePromiseValue} from "./services/use-promise-value.ts"
import {usePilot} from "./services/use-pilot.ts"
import {useOnce} from "./services/use-once.ts";
import {useLoaderData} from "react-router";
import { Layout } from "../../layout/Layout.tsx"

export const anylogicElementId = "anylogic"

export const RekentoolPage: FunctionComponent = () => {
    const {pilot} = useLoaderData()

    return (
        <Layout>
            <ConfigureAndSimulate initialPilot={pilot} />
        </Layout>
    )
}

type ConfigAndSimulateProps = {
    initialPilot?: Pilot,
    startImmediately?: boolean,
} & ComponentProps<"div">

/**
 * AnyLogic capture mouse wheel and trackpad scroll.
 * In our case we want to scroll the page like normal.
 */
function reEnableScroll() {
    const anyLogicElement = document.querySelector(`#${anylogicElementId} #svg-container`)
    if (!anyLogicElement) {
        console.error("Could not find AnyLogic element to re-enable scroll.")
        return
    }

    // @ts-expect-error I don't know why this doesn't type check
    anyLogicElement.addEventListener("wheel", (e: WheelEvent) => {
        window.scrollBy(e.deltaX, e.deltaY)
    })
}

export const ConfigureAndSimulate: FunctionComponent<ConfigAndSimulateProps> = ({
    initialPilot,
    startImmediately = Boolean(initialPilot),
    ...props
}) => {
    const pilotState = usePilot(initialPilot)
    const [pilot, setPilot] = pilotState
    const [showSimulation, setShowSimulation] = useState(false)
    const [simulation, setSimulation] = useState<AnyLogicCloudClient.Animation>()
    const [simulationOutOfSync, setSimulationOutOfSync] = useState(false)
    // enables to sync the GUI after simulation changes
    const forceUpdate = useForceUpdate()

    useEffect(() => {
        return () => {
            try {
                simulation?.stop()
            } catch {
                // ignore errors on cleanup
            }
        }
    }, [simulation])

    const onChange = async (pilot: Pilot) => {
        setPilot(pilot)
        setSimulationOutOfSync(true)
    }

    const onClickStart = async () => {
        simulation?.stop()
        setSimulationOutOfSync(false)
        const sessionId = await savePilot(pilot)
        setShowSimulation(true)
        const newSimulation = await startSimulation(anylogicElementId, sessionId)
        reEnableScroll()
        setSimulation(newSimulation)
        await newSimulation.waitForCompletion()
        forceUpdate()
    }

    useOnce(() => {
        if (startImmediately) {
            onClickStart()
        }
    });

    const showResourceFully = usePromiseValue(shouldShowResourcefully(simulation), false)

    return (
        <div style={{
            // styles for self
            flexGrow: 1,
            marginTop: "-1rem",
            width: "100%",
            // styles for children
            display: "flex",
            justifyContent: "center",
            alignItems: "start",
        }} {...props}>
            <div style={{
                // width: "30%",
                maxWidth: showSimulation ? "25rem" : "80rem",
                padding: "0rem 1rem 1rem 1rem",
                // borderRight: (showSimulation || undefined) && "1px solid #ccc",
            }}>
                <Configure
                    pilot={pilot}
                    onChange={onChange}
                    onClickStart={onClickStart}
                    showStartButton={!showSimulation}
                />
            </div>
            {showSimulation && (
                <div style={{padding: 0, flexGrow: 1, position: "sticky", top: 0}}>
                    <Simulate />
                    {simulation && showResourceFully &&
                        <ResourcefullyDialog pilotState={pilotState} anyLogicAnimation={simulation} />}
                    {simulationOutOfSync && <Overlay onClickStart={onClickStart} />}
                </div>
            )}
        </div>
    )
}

async function shouldShowResourcefully(simulation: AnyLogicCloudClient.Animation | undefined): Promise<boolean> {
    try {
        return await simulation?.getState() === "PAUSED"
    } catch {
        // simulation probably no longer exists serverside
        return false
    }
}

export const Overlay: FunctionComponent<{ onClickStart: () => void }> = ({onClickStart}) => (
    <div style={{
        position: "absolute",
        top: 0,
        // background: "radial-gradient(grey, white)",
        height: "100%",
        width: "100%",
        // opacity: ".7",
        backgroundColor: "rgba( 255, 255, 255, 0 )",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backdropFilter: "blur(3px)"
    }}>
        <PlayButton onClick={onClickStart} style={{opacity: 1}}/>
    </div>
)
