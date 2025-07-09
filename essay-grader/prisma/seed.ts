import { PrismaClient, GraderType } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // Create an Instruction with Criteria and Specifications
  const instruction = await prisma.instruction.create({
    data: {
      type: "argumentative",
      theme: "Freedom vs. Captivity",
      title: "Zakaj je bivanje za zaprtimi vrati in v skladišču peklensko?",
      prompt: "Napiši esej na temo ujetosti v sodobni družbi.",
      time: "60min",
      criteria: {
        create: [
          {
            label: "A",
            title: "Argumentacija",
            details: "Jasnost in logičnost argumentov.",
            scoringGuidelines: "Pojasni, kako dobro so argumenti razviti.",
            taxonomyLevel: "Analiza",
            parent: null,
            specifications: {
              create: [
                {
                  label: "A1",
                  title: "Jasnost",
                  details: "Ali so argumenti jasno izraženi?",
                  maxPoints: 4,
                  taxonomyLevel: "Analiza",
                },
                {
                  label: "A2",
                  title: "Logičnost",
                  details: "Ali so argumenti logično povezani?",
                  maxPoints: 4,
                  taxonomyLevel: "Analiza",
                },
              ],
            },
          },
          {
            label: "B",
            title: "Vsebina",
            details: "Ustreznost in globina vsebine eseja.",
            scoringGuidelines: "Ocenite, kako dobro vsebina podpira argumente.",
            taxonomyLevel: "Analiza",
            parent: null,
            specifications: {
              create: [
                {
                  label: "B1",
                  title: "Ustreznost",
                  details: "Ali vsebina ustreza temi in vprašanju?",
                  maxPoints: 4,
                  taxonomyLevel: "Analiza",
                },
                {
                  label: "B2",
                  title: "Globina",
                  details: "Ali esej pokaže globoko razumevanje teme?",
                  maxPoints: 4,
                  taxonomyLevel: "Analiza",
                },
              ],
            },
          },
          {
            label: "C",
            title: "Slog in jezik",
            details: "Jezikovna pravilnost, slog in struktura stavkov.",
            scoringGuidelines: "Ocenite, kako dobro je esej napisan.",
            taxonomyLevel: "Analiza",
            parent: null,
            specifications: {
              create: [
                {
                  label: "C1",
                  title: "Jezikovna pravilnost",
                  details: "Ali esej vsebuje veliko jezikovnih napak?",
                  maxPoints: 4,
                  taxonomyLevel: "Analiza",
                },
                {
                  label: "C2",
                  title: "Slog",
                  details: "Ali je slog pisanja ustrezen in učinkovit?",
                  maxPoints: 4,
                  taxonomyLevel: "Analiza",
                },
              ],
            },
          },
        ],
      },
    },
  });

  // Create an Essay
  const essay = await prisma.essay.create({
    data: {
      title: "Peklenska vrata in sodobni čas",
      author: "Matic Kovač",
      content: `Tema: UJETI ALI SVOBODNI?
Naslov: Zakaj je bivanje za zaprtimi vrati in v skladišču peklensko?

V življenju pogosto razmišljamo o svobodi in omejitvah, ki jih doživljamo bodisi kot posamezniki bodisi kot člani različnih skupnosti. V literaturi so prostori, v katere so liki umeščeni, pogosto več kot le fizična okolja; postanejo metafore za notranje in zunanje omejitve, ki določajo človeško bivanje. Sartrova drama Zaprta vrata in Mislejeva drama Naše skladišče sta dela, ki na izrazit način tematizirata ujetost – tako fizično kot psihično. V obeh primerih prostori, v katerih se znajdejo osebe, niso zgolj prizorišča dogajanja, temveč postanejo osrednji nosilci občutka pekla.

V drami Zaprta vrata so Garcin, Ines in Estelle po smrti postavljeni v zaprto sobo brez oken, v kateri ni mogoče ugasniti luči, vrata pa se odpirajo le od zunaj. Ta prostor je simbol dokončne ujetosti, kjer ni mogoče pobegniti ne fizično ne psihično. Osebe so prisiljene v nenehno konfrontacijo z drugimi in sami s seboj, njihova preteklost in občutek krivde postaneta neizogibna spremljevalca. Sartre v tej drami z znamenitim stavkom »Pekel so drugi« pokaže, da največje trpljenje ne izhaja iz zunanjih okoliščin, temveč iz odnosov med ljudmi, iz potrebe po potrditvi in strahu pred obsodbo. Soba, ki je sicer navadna, postane pekel zaradi nezmožnosti pobega pred lastnimi napakami in pred drugimi, ki jih nenehno spominjajo na pretekle grehe.

Na drugi strani Mislejeva drama Naše skladišče prikazuje štiri ženske, ki živijo in delajo v skladišču velike trgovine. Čeprav imajo na voljo osnovne življenjske dobrine, kot so stanovanje, tuš in hrana, jih delo v skladišču in pogoji, pod katerimi živijo, popolnoma izčrpavajo. Delovni urnik je neizprosen, prostega časa skoraj ni, pogosta so grožnje z odpuščanjem, plačilo je nizko, delo monotono. Delavke so podpisale pogodbo, ki jih veže na skladišče vse dni v tednu razen nedelje, kar še dodatno utrjuje občutek brezizhodnosti. Prostor, v katerem bivajo, ni več le delovno okolje, temveč postane simbol ujetosti v sistemu, ki ljudi izkorišča do skrajnih meja.

Obe drami torej prostorsko omejenost uporabljata kot prispodobo za širše družbene probleme. V Zaprtih vratih je pekel ustvarjen skozi medosebne odnose: Garcin, Ines in Estelle so najprej zadržani, potem pa se skozi razkritje preteklih dejanj odnosi zaostrujejo, postajajo polni napetosti, zavisti, potrebe po potrditvi in priznavanju krivde. Osebe so si drug drugemu mučitelji in hkrati edina družba, zato ni izhoda iz kroga vzajemnega povzročanja trpljenja. Na koncu spoznajo, da so obsojeni na večno soodvisnost in psihološki pritisk.

V skladišču pri Misleju pa odnosi med delavkami temeljijo na solidarnosti in skupnem preživetju. Čeprav so si značajsko različne in pripadajo različnim generacijam, jih težki pogoji zbližajo. Kljub včasih ostrim besedam in konfliktom med njimi prevladuje občutek pripadnosti, tovarištva in skupnega upanja na boljšo prihodnost. Skladišče tako postane ne le prizorišče izkoriščanja, temveč tudi prostor, kjer se rojevajo pristne vezi in odpornost proti dehumanizaciji.

Obe drami pa povezujeta občutek, da so vrata – fizična ali metaforična – bolj iluzija kot resnična možnost izhoda. V Sartrovem peklu vrata sicer obstajajo, a vodijo le navidez ven; niti ko so odprta, liki ne morejo zapustiti prostora, saj ugotovijo, da ni drugega kraja, kjer bi lahko obstajali brez občutka krivde. V skladišču pri Misleju pa vrata vodijo v svet negotovosti, brezposelnosti in še večjega trpljenja, zato delavke raje ostajajo v znanem peklu vsakdana. Misel »Če ti kaj ni všeč, veš, kje so vrata« postane kruta ironija, saj vrata ne ponujajo resnične svobode, temveč zgolj novo obliko ujetosti.

Sodobni človek se lahko v obeh situacijah prepozna. Tudi danes številni posamezniki doživljajo občutke brezizhodnosti v toksičnih odnosih, na delovnih mestih brez perspektive, v družbah, ki od posameznika zahtevajo popolno prilagoditev in žrtvovanje za preživetje. Probleme, ki jih izpostavljata obe drami – občutek krivde, izkoriščanje, psihični pritiski, odsotnost resnične izbire in upanja – srečujemo v različnih oblikah vsak dan. Socialna stiska, odtujenost, izguba smisla, tekmovalnost in pomanjkanje solidarnosti so le nekateri izmed »peklenskih« elementov sodobnega življenja.

Ali za sodobnega posameznika obstaja izhod iz pekla, ki ga ustvarja družba, delo, ali lastna psihologija? Sartre v svoji filozofiji eksistencializma vidi rešitev v sprejemanju odgovornosti za lastna dejanja in v prizadevanju za avtentično življenje. Pri Misleju je izhod v solidarnosti, skupni odpornosti in ohranjanju upanja na spremembo. Realnost pa pogosto kaže, da je iskanje izhoda težavno, počasno in polno ovir. Kljub temu ostaja možnost, da vsak posameznik s svojo držo, pogumom in pripravljenostjo za spremembo prispeva k ustvarjanju bolj človeških odnosov in družbe, ki ne bo temeljila na izkoriščanju, temveč na sodelovanju in sočutju.

V zaključku lahko rečem, da sta tako zaprta vrata kot skladišče prispodobi za različne oblike ujetosti, ki jih posameznik doživlja na psihični, družbeni in eksistencialni ravni. Ključ do izhoda pa ni v iskanju popolne svobode, temveč v priznanju lastnih omejitev, v prevzemanju odgovornosti in v iskanju smisla v odnosih z drugimi. Tako lahko pekel, ki ga doživljamo v zaprtih prostorih, vsaj deloma presežemo in najdemo svojo pot k svobodi.`,
      instructionId: instruction.id,
    },
  });

  // Fetch the first criterion for grading
  const criterion = await prisma.criterion.findFirst({
    where: { instructionId: instruction.id },
  });

  if (criterion) {
    await prisma.grade.create({
      data: {
        essayId: essay.id,
        criterionId: criterion.id,
        score: 7.5,
        grader: GraderType.AI,
        confidence: 0.95,
        comment: "Dobra argumentacija.",
        modelVersion: "gpt-4",
      },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
