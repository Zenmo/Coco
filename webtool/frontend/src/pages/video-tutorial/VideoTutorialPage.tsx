import {StartButton} from "../../shared-components/buttons/StartButton.tsx"
import {Footer} from "../../layout/footer/Footer.tsx"

export const VideoTutorialPage = () => (
    <div css={{
        display: "flex",
        flexDirection: "column",
        // justifyContent: "space-between",
        alignItems: "center",
        gap: "1rem",
    }}>
        <div css={{
            // for self
            boxSizing: "border-box",
            flexGrow: 1,
            padding: "10px",
            height: "100vh",
            // for children
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-evenly",
            gap: "1rem",
        }}>
            <video
                src="/Cocotutorial_H.264.mp4"
                controls
                style={{
                    minHeight: "0",
                    minWidth: "0",
                    maxWidth: "calc(100% - 20px)",
                    flexShrink: "1",
                    boxShadow: "0px 0px 5px 7px rgba(0, 0, 0, 0.30)",
            }}/>
            <StartButton />
        </div>
        <Footer />
    </div>
)
