# Wohnungsprotokoll – Zustandsfeststellung (PWA)

Eine installierbare Web-App (PWA) zur Dokumentation von Wohnungsabnahmen /
Zustandsfeststellungen. Pro **Objekt** (Wohnung) wird je **Gewerk**
(Maler, Boden, Fliesen, Sanitär, Elektro, Tischler, Reinigung) festgehalten:

- ✅ augenscheinlich ausgeführte Arbeiten
- ❗ vorhandene **Mängel**
- ➡️ noch offene Arbeiten

…jeweils als Stichpunkte mit **Fotos**. Am Ende lässt sich pro Objekt ein
sauberes **A4‑PDF** erzeugen. Alles funktioniert **offline**; die Daten bleiben
lokal auf dem Gerät.

---

## Was diese Version leistet

1. **Bilder werden korrekt abgelegt.**
   Fotos werden beim Aufnehmen verkleinert und als JPEG lokal in der
   IndexedDB gespeichert. Die **EXIF‑Drehung** wird korrekt angewendet
   (iPhone‑Fotos sind nicht mehr seitwärts), und die App fordert
   **dauerhaften Speicher** an (`navigator.storage.persist()`), damit iOS die
   Projekte und Fotos nicht nach einigen Tagen automatisch löscht.

2. **PDF zu jedem Objekt.**
   Über **„PDF erstellen"** wird mit der lokal mitgelieferten Bibliothek
   *jsPDF* eine echte PDF‑Datei erzeugt (Deckblatt mit Übersicht + eine Seite
   je Gewerk inkl. Fotos). Auf dem iPhone öffnet sich das **Teilen‑Menü**
   („In Dateien sichern", per Mail, AirDrop …). Das funktioniert auch in der
   **installierten** App – anders als `window.print()`, das in iOS‑PWAs oft
   nicht reagiert. Der Knopf **„Drucken"** nutzt zusätzlich den klassischen
   Browser‑Druck (v. a. für Desktop).

3. **Installierbar auf dem iPhone.**
   Web‑App‑Manifest, App‑Icons und ein **Service Worker** (Offline‑Betrieb)
   sind enthalten. Gehostet über **GitHub Pages** (HTTPS) lässt sich die App
   per Safari „Zum Home‑Bildschirm" als eigenständige App installieren.

---

## 📲 Auf dem iPhone installieren

Voraussetzung: Die App muss über **HTTPS** erreichbar sein. Am einfachsten via
GitHub Pages (kostenlos, ohne Mac/App Store/Apple‑Konto).

### 1. Hosting per GitHub Pages aktivieren (einmalig)

1. Im Repository **Settings → Pages** öffnen.
2. Unter **Build and deployment → Source** den Eintrag **„GitHub Actions"**
   wählen.
3. Den enthaltenen Workflow `.github/workflows/deploy-pages.yml` anstoßen –
   er läuft automatisch bei jedem Push auf `main` (bzw. den Arbeitsbranch)
   oder manuell über **Actions → „Deploy PWA to GitHub Pages" → Run workflow**.
4. Nach erfolgreichem Lauf steht die URL in **Settings → Pages**, üblicherweise:
   `https://daniel-trenz-web.github.io/Protokoll/`

> Hinweis: Falls das Deployment nur vom Standard‑Branch erlaubt ist, den
> Branch nach `main` mergen (oder in **Settings → Environments → github-pages**
> die Branch‑Beschränkung anpassen).

### 2. Installieren

1. Die Pages‑URL in **Safari** auf dem iPhone öffnen (nicht im privaten Modus).
2. Auf **Teilen** (Quadrat mit Pfeil) tippen → **„Zum Home‑Bildschirm"**.
3. Bestätigen – die App erscheint mit eigenem Icon und startet im Vollbild.

Danach läuft sie offline. Beim ersten Öffnen sollte einmal Internet bestehen,
damit der Service Worker alles für offline ablegt.

---

## 🗂 Daten & Backup

- Alle Projekte und Fotos liegen **ausschließlich lokal** auf dem Gerät
  (IndexedDB). Es gibt **keinen Server und keinen Upload** – nichts wird in
  eine Cloud hochgeladen.
- Jedes Foto wird **sofort lokal gespeichert**, direkt nachdem du es
  hinzufügst (kein „Senden"-Schritt nötig). Der dauerhafte Speicher wird beim
  Start angefordert, damit iOS die Daten nicht automatisch löscht.
- Über **⋯ → „Backup exportieren (JSON)"** lässt sich der gesamte Bestand als
  Datei sichern (z. B. nach „Dateien"/iCloud) und mit **„Backup importieren"**
  wiederherstellen oder auf ein anderes Gerät übertragen.
- **Empfehlung:** regelmäßig ein Backup exportieren. Wird die App vom
  Home‑Bildschirm gelöscht oder der Safari‑Speicher geleert, sind sonst die
  lokalen Daten weg.

> Möchtest du, dass Fotos/Projekte stattdessen **in eine Cloud hochgeladen**
> und zwischen Geräten synchronisiert werden? Das ist möglich, erfordert aber
> ein Backend (Server + Login + Speicher) und ist bewusst nicht Teil dieser
> rein lokalen Version.

---

## 🔒 Zugangsschutz (Passwort)

Beim Start verlangt die App ein **Passwort** (Sperrbildschirm). Standard ist
**`Admin`**.

- Änderbar über **⋯ → „Passwort ändern"** (aktuelles + neues Passwort).
- **⋯ → „Jetzt sperren"** sperrt sofort wieder.
- Das Passwort wird nur **als Hash lokal** gespeichert (nicht im Klartext).
- Hinweis: Dies ist ein **Zugangsschutz** für die App auf diesem Gerät –
  es ersetzt keine Verschlüsselung der gespeicherten Daten. Vergisst du das
  Passwort, lässt es sich durch Leeren der Website‑Daten zurücksetzen (dabei
  gehen aber die lokalen Projekte verloren – vorher Backup exportieren).

---

## 🧪 Lokal testen (optional, am Rechner)

Service Worker und Installierbarkeit brauchen `http(s)://` (nicht `file://`).
Im Projektordner einen einfachen Webserver starten, z. B.:

```bash
python3 -m http.server 8000
# oder:  npx serve .
```

Dann `http://localhost:8000/` im Browser öffnen. Die Kernfunktionen
(Erfassen, Fotos, PDF) laufen auch beim direkten Öffnen der `index.html`,
nur Installation/Offline‑Cache nicht.

---

## 📁 Projektstruktur

```
index.html                  Die komplette App (UI + Logik, ein File)
lib/jspdf.umd.min.js         PDF-Erzeugung (lokal eingebunden, offline)
manifest.webmanifest         PWA-Manifest (Name, Icons, Standalone)
sw.js                        Service Worker (Offline-Cache des App-Shells)
icons/                       App-Icons (180/192/512 + maskable, favicon)
.github/workflows/           GitHub-Pages-Deployment
.nojekyll                    Pages serviert Dateien unverändert
```

## 🔄 App aktualisieren

Nach Änderungen am Code in `sw.js` die Zeile `const VERSION = 'v1'` erhöhen
(z. B. `'v2'`). Dadurch wird der alte Offline‑Cache ersetzt und die installierte
App lädt beim nächsten Online‑Start die neue Version.

## 🔒 Technik

Reines HTML/CSS/JavaScript, kein Build‑Schritt. Speicherung in IndexedDB,
PDF‑Erzeugung mit [jsPDF](https://github.com/parallax/jsPDF) (MIT). Fotos
werden client‑seitig verkleinert; nichts verlässt das Gerät.
