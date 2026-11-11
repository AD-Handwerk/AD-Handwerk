// Daten der Stücke im Werke-Regal. Schlüssel = data-produkt in werke.html
// (und Dateiname media/produkte/ad_produkt_<schlüssel>.avif/.png für die Illustration).
//
// !!! BEISPIELDATEN: Jahre, Glasuren, Techniken und Maße sind ausgedacht, damit man sieht,
// !!! wie das Overlay fertig aussieht. Bitte durch die echten Angaben ersetzen.
// Angaben in [eckigen Klammern] werden im Overlay nicht angezeigt (Platzhalter).
//
//   jahr         Herstellungsjahr, steht unter dem Titel
//   liste        drei Angaben, in einer Zeile mit Trennstrichen (Material | Technik | Glasur)
//   masse        Maße, eigene Zeile darunter
//   freisteller  optional: freigestelltes Foto statt der Illustration im ersten Schritt,
//                Pfad OHNE Endung (erwartet .avif und .png)
//   fotos        echte Fotos im zweiten Schritt (im Blob beschnitten); leer = "Fotos folgen"
//                foto(Nummer, 'Beschreibung', 'Bildausschnitt')  →  media/fotos/IMG_<Nummer>.jpg
//                Bildausschnitt wie CSS object-position, z. B. '50% 40%' (Standard '50% 55%')

const foto = (nr, alt, pos = '50% 55%') => ({ src: `media/fotos/IMG_${nr}.jpg`, alt, pos });

const PRODUKTE = {
  'kuerbis-punkte': {
    titel: 'Kürbis mit Punkten',
    jahr: '2025',
    liste: ['Tonware gebrannt', 'Rakutechnik', 'Glasur gelb'],
    masse: 'H 24 cm · Ø 18 cm',
    freisteller: 'media/produkte/foto_kuerbis-punkte',
    fotos: [
      foto(8519, 'Gelber Kürbis mit schwarzen Löchern, Frontansicht'),
      foto(8520, 'Gelber Kürbis, Nahansicht'),
      foto(8521, 'Gelber Kürbis von oben'),
      foto(8523, 'Gelber Kürbis auf Holz')
    ]
  },
  'kuerbis-rund': {
    titel: 'Runder Kürbis',
    jahr: '2025',
    liste: ['Tonware gebrannt', 'Rakutechnik', 'Glasur orange'],
    masse: 'H 18 cm · Ø 16 cm',
    freisteller: 'media/produkte/foto_kuerbis-rund',
    fotos: [
      foto(8520, 'Runder Kürbis, Nahansicht'),
      foto(8522, 'Zwei Kürbisse in unterschiedlicher Größe')
    ]
  },
  'wichtel': {
    titel: 'Wichtel mit Stern',
    jahr: '2025',
    liste: ['Tonware gebrannt', 'Rakutechnik', 'Glasur rot'],
    masse: 'H 22 cm',
    fotos: []
  },
  'pusteblume-gross': {
    titel: 'Pusteblumen-Kugel groß',
    jahr: '2024',
    liste: ['Tonware gebrannt', 'Handaufbau', 'Glasur weiß'],
    masse: 'Ø 30 cm',
    freisteller: 'media/produkte/foto_pusteblume-gross',
    fotos: [
      foto(8539, 'Weiße Kugel mit Lochmuster'),
      foto(8540, 'Große Kugel mit Pusteblumen-Motiv'),
      foto(8541, 'Pusteblume im Detail'),
      foto(8543, 'Große und kleine Kugel zusammen')
    ]
  },
  'pusteblume-klein': {
    titel: 'Pusteblumen-Kugel klein',
    jahr: '2024',
    liste: ['Tonware gebrannt', 'Handaufbau', 'Glasur weiß'],
    masse: 'Ø 18 cm',
    fotos: [
      foto(8542, 'Kleine und große Kugel nebeneinander'),
      foto(8543, 'Kleine Kugel neben der großen')
    ]
  },
  'schale-blumen': {
    titel: 'Blumenschale',
    jahr: '2025',
    liste: ['Tonware gebrannt', 'Rakutechnik', 'Glasur grün'],
    masse: 'H 14 cm · Ø 20 cm',
    freisteller: 'media/produkte/foto_schale-blumen',
    fotos: [
      foto(8515, 'Schale mit grüner Innenglasur, von der Seite'),
      foto(8516, 'Schale mit Lochmuster, Frontansicht'),
      foto(8517, 'Schale, Nahansicht der Innenseite'),
      foto(8518, 'Schale von oben')
    ]
  },
  'vase-graeser': {
    titel: 'Vase mit Gräsern',
    jahr: '2025',
    liste: ['Tonware gebrannt', 'Rakutechnik', 'Glasur weiß'],
    masse: 'H 16 cm · Ø 13 cm',
    fotos: []
  },
  'laterne-hoch': {
    titel: 'Hohe Laterne',
    jahr: '2024',
    liste: ['Tonware gebrannt', 'Handaufbau', 'Glasur weiß'],
    masse: 'H 38 cm',
    fotos: []
  },
  'laterne-zwiebel': {
    titel: 'Zwiebel-Laterne',
    jahr: '2024',
    liste: ['Tonware gebrannt', 'Rakutechnik', 'Glasur grün'],
    masse: 'H 30 cm · Ø 22 cm',
    fotos: []
  },
  'schneemann': {
    titel: 'Schneemann',
    jahr: '2025',
    liste: ['Tonware gebrannt', 'Rakutechnik', 'Glasur weiß'],
    masse: 'H 20 cm',
    freisteller: 'media/produkte/foto_schneemann',
    fotos: [
      foto(8483, 'Schneemann mit blauem Schal'),
      foto(8484, 'Schneemann, Seitenansicht'),
      foto(8485, 'Schneemann mit schwarzem Hut'),
      foto(4303, 'Schneemann zwischen Tannenzweigen und Zapfen')
    ]
  }
};
