import {FunctionComponent} from "react"
import {ExternalIconLink} from "../../../shared-components/links/ExternalIconLink.tsx"
import {Grid} from "@radix-ui/themes"
import {css} from "@emotion/react"
import {
    local4localBlue,
    local4localDarkOrange, local4localGreen,
    local4localLightBlue,
    local4localLightGreen,
    local4localLightOrange
} from "../../../colors.ts"
import {ExampleCases} from "./ExampleCases.tsx";

const wikiLink = "https://local4local.notion.site/Hoe-maak-ik-een-grove-berekening-van-de-gelijktijdigheid-van-mijn-energiegemeenschap-17a0306d63c2805ba3c8d60695d662b5"

const introTextStyle = css({
    padding: "1.5rem 2rem",
    textAlign: "justify",
    textAlignLast: "center",
    // border: "1px solid #ccc",
    borderRadius: "28px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-evenly",
    gap: "1rem",
    alignItems: "center",
    "& h2, & h1, & h3": {
        padding: 0,
        margin: 0,
        textAlign: "center",
        wordSpacing: ".2em",
    },
    "& p": {
        marginTop: 0,
    }
})

export const IntroText: FunctionComponent = () => {
    return (
        <Grid
            columns={{
                initial: "1",
                md: "2",
            }}
            rows={{
                initial: "repeat(4, auto)",
                md: "1fr 1fr",
            }}
            gap="4"
            style={{
                margin: "0rem 1rem",
                maxWidth: "80rem",
            }}>
            <div css={introTextStyle} style={{background: local4localLightGreen + "4A"}}>
                <h1 style={{color: local4localGreen}}>Simuleer je energiegemeenschap</h1>
                <p>
                    Welkom bij de Local 4 Local Coöperatie Configurator. Met deze tool kun je je
                    eigen energiegemeenschap nabouwen en simuleren. Je stelt in
                    welke <strong>zonneparken</strong> en <strong>windmolens</strong> je beheert,
                    wat de <strong>kostprijs</strong> is van de stroom die je opwekt, en aan
                    welke klanten cq. <strong>leden</strong> je stroom gaat leveren.
                    Daarbij kun je ook instellen of die leden zelf ook zonnepanelen hebben, of ze een <strong>elektrische
                    auto</strong> opladen
                    en of ze een <strong>warmtepomp</strong> hebben.
                </p>
            </div>
            <div css={introTextStyle} style={{background: local4localDarkOrange + "4A"}}>
                <h2 style={{color: local4localDarkOrange}}>Gelijktijdigheid optimaliseren</h2>
                <p>
                    De Coöperatie Configurator geeft je vervolgens inzicht in de
                    totale <strong>opwek</strong> en <strong>verbruik</strong> van elektriciteit
                    binnen de gemeenschap, en de <strong>gelijktijdigheid</strong> van die twee. Je kunt interactief
                    veranderingen doorvoeren,
                    zoals het bijplaatsen van zonnepanelen of windmolens, of het aanpassen van
                    je ledenbestand.
                </p>
            </div>
            <div css={introTextStyle} style={{background: local4localLightOrange + "4A"}}>
                <h2 style={{color: local4localLightOrange}}>Zorgvuldige prijsberekening</h2>
                <p>
                    Op basis van de kostprijs van opgewekte elektriciteit,
                    de inkoop en verkoop, en de weersdata en marktprijzen van elektriciteit uit 2023 wordt
                    een inschatting gemaakt van de tarieven. We maken onderscheid in een tarief voor
                    gelijktijdige en ongelijktijdige levering. Het tarief voor gelijktijdige levering
                    heet <strong>Kostprijs+</strong>.
                </p>
                <p>
                    Bij de bepaling van de tarieven wordt gezorgd dat de coöperatie en de leverancier
                    <strong> precies break-even</strong> draaien.
                    Zonder winstoogmerk, maar ook zonder verlies te draaien dus.
                </p>
            </div>
            <div css={introTextStyle} style={{background: local4localLightBlue + "4A"}}>
                <h2 style={{color: local4localBlue}}>Lokaal samenwerken</h2>
                <p>
                    Dit geeft je de mogelijkheid om jouw optimale <strong>energiegemeenschap</strong> te vormen,
                    zowel
                    op gebied
                    van <strong>energiebalans</strong> en <strong>duurzaamheid</strong>, als ook met een
                    aantrekkelijk <strong>energietarief</strong> voor je leden. Probeer het zelf
                    uit, het is makkelijker dan je denkt!
                </p>
            </div>
            <div css={introTextStyle} style={{background: local4localLightGreen + "4A"}}>
                <h2 style={{color: local4localGreen}}>Voorbeeldcasussen</h2>

                <p>
                    Om een idee te krijgen van hoe de tool te gebruiken, staan er een paar voorbeeldcasussen klaar:
                </p>

                <ExampleCases />
            </div>
            <div css={introTextStyle} style={{background: local4localDarkOrange + "4A",}}>
                <p>
                    Deze tool is onderdeel van een stappenplan om een energiegemeenschap op te richten.
                </p>
                <img
                    src="/step-diagram-translucent.png"
                    style={{
                        width: "105%",
                    }}
                    alt="stappenplan: initiatie, ontwerp, uitwerking, implementatie, exploitatie"
                />
                <p style={{textAlign: "center"}}>
                    Meer informatie over deze tool en over local4local is te vinden in de&nbsp;
                    <ExternalIconLink href={wikiLink}>local4local kennisbank</ExternalIconLink>
                </p>
            </div>
        </Grid>
    )
}
