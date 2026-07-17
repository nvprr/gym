// ===================== EXERCISE_DETAIL.JS =====================
// Szczegóły ćwiczenia + Analiza planu

// ── Opisy ćwiczeń (baza wiedzy) ──
var EX_DESCRIPTIONS = {
  // Klatka
  'e1':  { desc:'Połóż się na ławce poziomej, chwyć sztangę na szerokość ramion. Opuść do klatki, wciśnij mocno w górę. Trzymaj łopatki ściągnięte przez cały ruch.', tips:['Trzymaj stopy płasko na podłodze','Nie odbijaj sztangi od klatki','Kontroluj fazę ekscentryczną'], mistakes:['Zbyt szerokie rozstawienie łokci','Wygięcie nadgarstków','Unoszenie bioder z ławki'] },
  'e4':  { desc:'Przyjmij pozycję deski, dłonie na szerokość barków. Zegnij łokcie i opuść klatkę do ziemi, następnie wypchnij w górę. Core napięty przez cały czas.', tips:['Utrzymuj prostą linię ciała','Wciągaj brzuch','Pełny zakres ruchu'], mistakes:['Opuszczanie bioder','Zbyt szybkie tempo','Niepełny wyprost łokci'] },
  // Plecy
  'e7':  { desc:'Chwyć drążek nachwytem na szerokość barków. Podciągnij się do momentu gdy broda przekroczy drążek, kontrolowanie opuść się. Łopatki ściągnięte przy podciąganiu.', tips:['Inicjuj ruch od łopatek','Nie kiwaj tułowiem','Pełny wyprost na dole'], mistakes:['Kiwanie się','Zbyt wąski chwyt','Brak kontroli przy opuszczaniu'] },
  'e8':  { desc:'Stań w skłonie 45°, chwyć sztangę podchwytem. Przyciągnij do brzucha, ściskając łopatki. Kontrolowanie opuść.', tips:['Utrzymuj neutralny kręgosłup','Przyciągaj łokcie blisko ciała','Ściągaj łopatki w końcowej fazie'], mistakes:['Zaokrąglone plecy','Zbyt duży ciężar','Ruch ramionami zamiast łopatkami'] },
  // Barki
  'e30': { desc:'Stań w lekkim rozkroku, chwyć hantle. Unieś boczne ramiona do poziomu barków, łokcie lekko ugięte. Kontrolowane opuszczanie.', tips:['Nie wzruszaj barkami','Lekkie ugięcie łokci','Zatrzymaj na poziomie barków'], mistakes:['Unoszenie ramion zbyt wysoko','Używanie rozmachu','Zbyt szybkie opuszczanie'] },
  // Biceps
  'e40': { desc:'Stań prosto, chwyć hantle podchwytem. Ugnij łokcie i unieś hantle do barków, ściskając biceps. Powoli opuść.', tips:['Trzymaj łokcie przy tułowiu','Pełny zakres ruchu','Nie kiwaj tułowiem'], mistakes:['Kiwanie ciałem','Zbyt szybki ruch ekscentryczny','Łokcie odrywają się od tułowia'] },
  // Triceps
  'e50': { desc:'Stań przy wyciągu górnym, chwyć uchwyt. Wyprostuj łokcie, dociskając drążek w dół. Górna część ramienia nieruchoma.', tips:['Stabilne łokcie przy tułowiu','Pełny wyprost','Powoli wracaj do góry'], mistakes:['Ruszanie łokciami','Zbyt duży ciężar','Brak pełnego wyprostu'] },
  // Nogi
  'e60': { desc:'Stań w rozkroku na szerokość barków, stopy lekko skierowane na zewnątrz. Zegnij kolana i opuść biodra do poziomu ud, następnie wstań. Core napięty.', tips:['Kolana idą w kierunku palców','Pięty na podłodze','Wciągaj brzuch'], mistakes:['Kolana do środka','Zaokrąglone plecy','Zbyt płytkie przysiady'] },

  // ── KLATKA (dodatkowe) ──
  'e2':  { desc:'Połóż się na ławce skośnej 30-45°. Chwyć hantle na poziomie barków i wyciśnij je ku górze łącząc nad klatką. Większy zakres ruchu niż przy sztandze i lepsze rozciągnięcie górnej klatki.', tips:['Kąt 30-45° dla górnej klatki','Hantle blisko klatki na starcie','Pełne rozciągnięcie na dole'], mistakes:['Zbyt wysoki kąt ławki — angażuje bardziej barki','Brak kontroli przy opuszczaniu','Rotacja nadgarstków'] },
  'e2b': { desc:'Wyciskanie sztangi na ławce skośnej. Połóż się pod kątem 30-45°, chwyć sztangę nieco szerzej niż barki. Opuść do górnej części klatki i wypchnij w górę. Buduje siłę górnej klatki.', tips:['Opuszczaj sztangę do górnej klatki','Stabilny kontakt łopatek z ławką','Chwyć pewnie z kciukiem za sztangą'], mistakes:['Zbyt szeroki chwyt','Odbijanie od klatki','Brak asekuracji przy dużych ciężarach'] },
  'e2c': { desc:'Ławka pod ujemnym kątem 15-30° akcentuje dolną część klatki. Chwyć hantle, opuść do dolnej klatki i wypchnij w górę. Pewnie zapiąć nogi — pozycja niekomfortowa.', tips:['Pewnie zapiąć nogi na podparciach','Nie przekraczaj 30° kąta','Kontroluj ciężar przez cały czas'], mistakes:['Zbyt stromy kąt','Opuszczanie rąk za głowę','Brak kontroli'] },
  'e3':  { desc:'Połóż się na ławce, trzymaj hantle nad klatką z lekko ugiętymi łokciami. Opuszczaj szeroko na boki w łuku czując rozciągnięcie klatki, następnie zamknij łuk nad klatką. Ćwiczenie izolacyjne — skup się na mięśniu.', tips:['Utrzymuj stały kąt ugięcia łokci','Zatrzymaj na chwilę na dole','Wyobraź sobie obejmowanie drzewa'], mistakes:['Zbyt duże ugięcie łokci — zamieniasz w wyciskanie','Za duży ciężar — brak kontroli','Brak pełnego rozciągnięcia'] },
  'e3b': { desc:'Stań między dwoma wyciągami. Chwyć uchwyty, pochyl lekko tułów i przeciągnij linki do przodu ściskając klatkę. Wyciąg zapewnia stałe napięcie przez cały zakres ruchu.', tips:['Stała pozycja tułowia','Skup na ściskaniu klatki w końcu ruchu','Powolny powrót pod kontrolą'], mistakes:['Zbyt duże wychylenie tułowia','Używanie ramion zamiast klatki','Gwałtowne puszczanie linek'] },
  'e3c': { desc:'Rozpiętki na ławce skośnej 30-45°. Opuszczaj hantle szeroko skupiając się na rozciągnięciu górnej klatki. Łącz hantle nad klatką mocno ją ściskając.', tips:['Powolne opuszczanie dla maksymalnego rozciągnięcia','Kąt ławki identyczny jak przy wyciskaniu skośnym','Nie przesadzaj z ciężarem'], mistakes:['Zbyt gwałtowne opuszczanie','Nadmierne ugięcie łokci','Brak ściskania w górnym punkcie'] },
  'e4b': { desc:'Chwyć poręcze i podepnij się. Pochyl tułów do przodu dla większego zaangażowania klatki. Zegnij łokcie i opuść do pełnego rozciągnięcia, następnie wypchnij się w górę. Mocne ćwiczenie na klatkę i triceps.', tips:['Pochyl tułów do przodu dla klatki','Kontrolowane opuszczanie','Nie blokuj łokci na górze'], mistakes:['Zbyt gwałtowne opuszczanie','Brak pełnego zakresu ruchu','Wzruszanie barkami'] },
  'e5':  { desc:'Wyciskanie w suwnicy Smitha eliminuje potrzebę balansowania — dobre dla treningu solo lub dla początkujących. Ustaw ławkę pod sztangą i wyciśnij. Smith zmienia naturalną trajektorię ruchu.', tips:['Ustaw ławkę tak by sztanga szła nad środkiem klatki','Zachowaj lekki łuk pleców','Bezpieczna opcja do treningu solo'], mistakes:['Ustawianie ławki zbyt wysoko lub nisko','Zbyt pionowy ruch','Zaniedbywanie ćwiczeń ze swobodnymi ciężarami'] },
  'e5b': { desc:'Usiądź na maszynie pec deck, chwyć uchwyty. Przyciśnij je do siebie mocno ściskając klatkę. Puść kontrolowanie. Maszyna zapewnia izolację klatki przy minimalnym ryzyku kontuzji.', tips:['Skup się na powolnym ściskaniu','Siedź prosto z plecami na oparciu','Pełny zakres ruchu'], mistakes:['Używanie zbyt dużego ciężaru','Brak kontroli przy powrocie','Odrywanie pleców od oparcia'] },
  'f1':  { desc:'Wyciskanie szerokim chwytem angażuje bardziej zewnętrzne włókna klatki i zmniejsza zaangażowanie tricepsa. Chwyć sztangę szerzej niż zwykle, reszta techniki jak w bench press.', tips:['Chwyt szerszy niż barki','Zawsze asekurant','Pełny zakres ruchu'], mistakes:['Nadmierne rozszerzenie łokci — ryzyko barku','Brak asekuracji','Zbyt duże obciążenie na start'] },
  'f2':  { desc:'Połóż się na podłodze z hantlami. Wyciskaj jak na ławce ale podłoga ogranicza zakres do ok. 90° w łokciu. Chroni stawy barkowe i dobrze izoluje triceps i klatkę.', tips:['Łokcie dotykają podłogi na dole','Dobre dla barków z historią kontuzji','Pełny wyprost na górze'], mistakes:['Odbijanie łokci od podłogi','Zbyt szybki ruch','Brak napięcia klatki'] },
  'f3':  { desc:'Wyciskanie w maszynie z kontrolowanym torem ruchu. Usiądź, ustaw uchwyt na poziomie klatki i wyciśnij. Bezpieczna alternatywa dla sztangi, szczególnie dla początkujących lub przy rehabilitacji.', tips:['Reguluj siedzisko na właściwą wysokość','Pełny zakres ruchu','Powolna faza ekscentryczna'], mistakes:['Brak regulacji siedziska','Za szybki ruch','Wzruszanie barkami'] },
  'f4':  { desc:'Wyciskanie skośne w maszynie angażuje górną klatkę ze stabilnym torem ruchu. Bezpieczna alternatywa dla wyciskania ze sztangą na skośnej ławce.', tips:['Ustaw siedzisko na właściwą wysokość','Klatka do przodu','Pełny zakres ruchu'], mistakes:['Zła regulacja siedziska','Brak zaangażowania klatki','Zbyt duże obciążenie'] },
  'f5':  { desc:'Rozpiętki skośnie w dół angażują dolną klatkę. Połóż się na ławce ujemnej i wykonaj ruch łukowy hantlami skupiając się na dolnej części klatki.', tips:['Bezpiecznie zapiąć nogi','Ugięte łokcie przez cały czas','Skupiaj się na dolnej klatce'], mistakes:['Brak asekuracji nóg','Wyprostowanie łokci','Zbyt duże obciążenie'] },
  'f6':  { desc:'Wyciskanie skośnie w dół z hantlami na ławce ujemnej. Zapnij nogi, hantle nad klatką, wyciskaj kontrolując ruch. Angażuje dolne włókna klatki.', tips:['Zapnij nogi bezpiecznie','Hantle równolegle na starcie','Kontroluj powrót'], mistakes:['Brak asekuracji','Rotacja hantli','Zbyt szybki ruch'] },
  'f7':  { desc:'Wyciskanie skośnie w dół ze sztangą to zaawansowane ćwiczenie na dolną klatkę. Bezpiecznie zapnij nogi i zawsze używaj asekuranta.', tips:['Zawsze asekurant','Chwyt nieco szerszy niż barki','Opuszczaj do dolnej klatki'], mistakes:['Brak asekuracji — bardzo niebezpieczne','Zbyt duże obciążenie','Zła pozycja ławki'] },
  'f8':  { desc:'Rozciąganie na wyciągu krzyżowym to izolacja klatki z ciągłym napięciem przez cały zakres. Stań między wyciągami i wykonuj powolne kontrolowane łuki.', tips:['Stała pozycja tułowia','Lekkie ugięcie łokci','Ściśnij klatkę w centrum'], mistakes:['Prostowanie łokci','Za szybki ruch','Pochylanie tułowia'] },
  'f9':  { desc:'Pompki na kolanach to modyfikacja dla początkujących. Kolana na podłodze, prosta linia od kolan do głowy. Dobry start przed przejściem do klasycznych pompek.', tips:['Utrzymuj prostą linię od kolan do głowy','Pełny zakres ruchu','Core napięty'], mistakes:['Opadanie bioder','Zbyt szybkie tempo','Niekompletny zakres'] },
  'f10': { desc:'Pompki szerokim chwytem bardziej angażują klatkę a mniej triceps. Rozstaw dłonie szerzej niż w klasycznych pompkach i wykonaj pełny zakres ruchu.', tips:['Chwyt szerszy niż barki','Pełny zakres ruchu','Core napięty przez cały czas'], mistakes:['Opadanie bioder','Zbyt wąski chwyt','Brak kontroli'] },
  'f11': { desc:'Pompki diamentowe — złącz kciuki i wskazujące palce tworząc trójkąt. Mocno angażują triceps i wewnętrzną klatkę. Trudniejsze od klasycznych pompek.', tips:['Dłonie pod klatką blisko siebie','Pełny zakres ruchu','Core napięty i prosty kręgosłup'], mistakes:['Zbyt szerokie dłonie','Opadanie bioder','Ból nadgarstków — zmień pozycję dłoni'] },
  'f12': { desc:'Wyciskanie wąskim chwytem na ławce skośnej angażuje górną klatkę i triceps. Chwyt nieco węższy niż przy normalnym wyciskaniu skośnym.', tips:['Chwyt wąski ale komfortowy','Łokcie blisko tułowia','Opuszczaj do górnej klatki'], mistakes:['Zbyt wąski chwyt — ból nadgarstków','Brak asekuranta','Zbyt duże obciążenie'] },
  'f13': { desc:'Spoto Press to wyciskanie z pauzą w połowie zakresu ruchu. Buduje siłę w trudnym punkcie i uczy świadomości ciała podczas wyciskania.', tips:['Pauza dokładnie w połowie zakresu','Nie rozluźniaj mięśni w pauzie','Powolne kontrolowane tempo'], mistakes:['Zbyt krótka pauza','Odbijanie od klatki','Nieprawidłowa pozycja łopatek'] },
  'f14': { desc:'Larsen Press to wyciskanie bez oparcia nóg o podłogę — nogi uniesione lub wyciągnięte. Usuwa łuk pleców i zwiększa zaangażowanie stabilizatorów klatki.', tips:['Nogi uniesione i złączone','Napięty core przez cały czas','Pełne rozciągnięcie klatki'], mistakes:['Zbyt duże obciążenie','Utrata stabilizacji','Opuszczanie nóg dla ułatwienia'] },
  'f15': { desc:'Pullover ze sztangą angażuje klatkę i najszerszy grzbiet. Leż prostopadle na ławce, opuszczaj sztangę za głowę z ugiętymi łokciami i wróć.', tips:['Leż prostopadle do ławki','Kontroluj ruch za głowę','Łokcie ugięte — nie rozciągaj za mocno'], mistakes:['Zbyt duże obciążenie','Prostowanie łokci','Brak kontroli za głową'] },
  'f16': { desc:'Pullover z hantlem angażuje klatkę i najszerszy grzbiet. Trzymaj jeden hantel obiema rękami, opuszczaj za głowę z ugiętymi łokciami.', tips:['Chwyć hantel dłońmi od środka','Łokcie lekko ugięte','Pełny zakres ruchu'], mistakes:['Prostowanie łokci','Zbyt duże obciążenie','Brak kontroli ruchu'] },

  // ── PLECY (dodatkowe) ──
  'e6':  { desc:'Stań nad sztangą, stopy na szerokość bioder. Chwyć sztangę, wyprostuj plecy i podnieś ciągnąc wzdłuż nóg. Wyprostuj biodra i kolana jednocześnie. To jedno z najważniejszych ćwiczeń siłowych angażujących całe ciało.', tips:['Sztanga blisko nóg przez cały ruch','Kręgosłup neutralny — nie zaokrąglaj pleców','Weź głęboki wdech przed podniesieniem'], mistakes:['Zaokrąglone plecy — najgroźniejszy błąd','Szarpanie zamiast płynnego ruchu','Sztanga zbyt daleko od nóg'] },
  'e6b': { desc:'Martwy ciąg rumuński angażuje łańcuch tylny: pośladki, ścięgna podkolanowe i dolne plecy. Nogi lekko ugięte, pochyl tułów do przodu z neutralnymi plecami opuszczając ciężar wzdłuż nóg. Wróć siłą bioder.', tips:['Poczuj rozciągnięcie ścięgien podkolanowych','Biodra idą do tyłu — nie kolana w dół','Utrzymaj naturalne wygięcie pleców'], mistakes:['Zaokrąglone plecy','Zgięcie kolan jak przy przysiądzie','Opuszczanie ciężaru za nisko'] },
  'e6c': { desc:'Martwy ciąg sumo z szerszym rozstawem nóg i stopami na zewnątrz. Chwyt wąski między nogami. Mniej obciąża dolne plecy, bardziej angażuje pośladki i wewnętrzne uda.', tips:['Kolana idą w kierunku palców stóp','Biodra nisko na starcie','Pchaj podłogę nogami — nie ciągnij plecami'], mistakes:['Kolana do środka','Zbyt wąski chwyt','Biodra zbyt wysoko na starcie'] },
  'e7b': { desc:'Podchwyt bardziej angażuje biceps, przez co wiele osób robi więcej powtórzeń. Ściągnij łopatki, podciągnij się do brody nad drążkiem, kontrolowanie opuść do pełnego wyprostu.', tips:['Łatwiejszy wariant dla wielu osób','Pełny wyprost na dole każdego powtórzenia','Nie kiwaj tułowiem'], mistakes:['Kiwanie tułowiem dla rozpędu','Brak pełnego wyprostu','Zbyt szybkie opuszczanie'] },
  'e8b': { desc:'Wiosłowanie T-barem z podparciem klatki eliminuje kiwanie tułowia. Połóż klatkę na oparciu i przyciągaj ciężar ściskając łopatki. Dobra opcja dla osób z bólem dolnych pleców.', tips:['Klatka stabilnie na oparciu','Ściągaj łopatki','Pełny zakres ruchu'], mistakes:['Wzruszanie barkami','Zbyt duży ciężar kosztem techniki','Brak pełnego wyprostu'] },
  'e9':  { desc:'Usiądź przy maszynie, chwyć drążek szerokim nachwytem nad głową. Ściągnij do klatki inicjując ruch łopatkami. Kontrolowanie puść w górę. Dobry substytut podciągania.', tips:['Inicjuj od łopatek — nie od ramion','Drążek do górnej klatki, nie do brzucha','Lekkie wychylenie głowy do tyłu'], mistakes:['Ciągnięcie siłą ramion','Wychylanie się zbyt mocno do tyłu','Drążek za nisko'] },
  'e9b': { desc:'Usiądź przy wyciągu dolnym, chwyć uchwyt. Siedź prosto i przyciągnij do brzucha ściskając łopatki. Kontrolowanie wyprostuj ręce. Angażuje środkowe plecy i romboidy.', tips:['Plecy wyprostowane przez cały czas','Nie kiwaj tułowiem','Ściągnij łopatki w fazie końcowej'], mistakes:['Kiwanie tułowiem','Zaokrąglone plecy','Zbyt szybki ruch powrotny'] },
  'e10': { desc:'Oprzyj kolano i rękę na ławce. Drugą ręką chwyć hantel i przyciągnij do boku klatki z łokciem wysoko. Doskonałe do likwidacji asymetrii między stronami ciała.', tips:['Plecy równoległe do podłogi','Łokieć idzie wysoko ponad plecy','Pełny wyprost ramienia na dole'], mistakes:['Skręcanie tułowia','Zbyt gwałtowne ciągnięcie','Brak pełnego wyprostu'] },
  'e10b':{ desc:'Stań przy wyciągu górnym z liną na poziomie twarzy. Przyciągnij linę do twarzy z łokciami na poziomie barków i zewnętrzną rotacją. Kluczowe dla zdrowia barków i postawy.', tips:['Łokcie wyżej niż nadgarstki w końcowej fazie','Ściągnij łopatki','Lekkie ciężary — to ćwiczenie korekcyjne'], mistakes:['Za duży ciężar','Łokcie poniżej nadgarstków','Brak ściągnięcia łopatek'] },
  'e10c':{ desc:'Połóż się twarzą w dół na maszynie hiperekstenśji. Zegnij tułów w dół i podnieś do linii prostej lub lekko wyżej. Wzmacnia dolne plecy, pośladki i ścięgna podkolanowe.', tips:['Ruch do linii bioder — nie wyżej','Powolny i kontrolowany','Można trzymać obciążenie przy piersi dla trudniejszej wersji'], mistakes:['Zbyt duże wygięcie — ryzyko kontuzji','Zginanie szyi','Zbyt szybkie tempo'] },
  'e10d':{ desc:'Stań trzymając sztangę lub hantle przed udami. Wzrusz barkami maksymalnie w górę i do tyłu, utrzymaj przez sekundę, opuść. Angażuje czworoboczny górny.', tips:['Wzruszaj do góry i do tyłu','Nie kręć barkami','Pełne opuszczenie dla pełnego zakresu'], mistakes:['Kręcenie barkami','Zbyt duże obciążenie','Zbyt szybkie tempo'] },
  'g1':  { desc:'Wiosłowanie szerokim chwytem siedząc przy wyciągu angażuje szersze partie pleców. Siedź prosto i ściągaj szerokim chwytem do klatki.', tips:['Chwyt szerszy od barków','Ściągaj do klatki','Powolny powrót'], mistakes:['Odginanie do tyłu','Wzruszanie barkami','Zbyt szybki powrót'] },
  'g2':  { desc:'Wiosłowanie w maszynie siedząc zapewnia bezpieczny tor ruchu. Usiądź na maszynie i ściągaj uchwyt do brzucha ściskając łopatki.', tips:['Reguluj siedzisko','Pełny zakres ruchu','Ściągaj łopatki'], mistakes:['Zła regulacja','Wzruszanie barkami','Zbyt szybki ruch'] },
  'g3':  { desc:'Wiosłowanie odwróconym chwytem (podchwytem) angażuje bardziej biceps i dolny najszerszy. Pochyl się w skłonie i przyciągaj do pępka.', tips:['Tułów stabilny w skłonie','Przyciągaj do pępka','Ściągaj łopatki'], mistakes:['Zaokrąglone plecy','Wzruszanie barkami','Zbyt duże obciążenie'] },
  'g4':  { desc:'Wiosłowanie Pendlay ze sztangą na podłodze między powtórzeniami. Każde powtórzenie startuje ze statycznej pozycji co wymaga eksplozywnej siły.', tips:['Sztanga na podłodze po każdym powt.','Tułów równoległy do podłogi','Eksplozywny ruch'], mistakes:['Zaokrąglone plecy','Kiwanie tułowia','Brak zatrzymania na dole'] },
  'g5':  { desc:'Wiosłowanie Meadows jednostronnie przy T-barze. Stań bokiem do maszyny i wiosłuj jedną ręką z szerokim zakresem ruchu.', tips:['Stabilna pozycja bokiem','Pełny zakres ruchu','Ściągaj łopatkę'], mistakes:['Rotacja tułowia','Zbyt duże obciążenie','Brak zakresu'] },
  'g6':  { desc:'Wiosłowanie w opadzie z hantlami angażuje całe plecy. Pochyl tułów trzymając hantle nachwytem i przyciągaj do bioder.', tips:['Tułów stabilny w skłonie','Ściągaj łopatki','Pełny zakres ruchu'], mistakes:['Zaokrąglone plecy','Kiwanie tułowia','Zbyt szybkie tempo'] },
  'g7':  { desc:'Ściąganie wąskim chwytem angażuje bardziej wewnętrzny najszerszy. Chwyć uchwyt neutralnie lub wąsko i ściągaj do klatki z łokciami blisko tułowia.', tips:['Chwyt neutralny lub wąski','Ściągaj do mostka','Łokcie blisko tułowia'], mistakes:['Kiwanie tułowia','Wzruszanie barkami','Zbyt szybki powrót'] },
  'g8':  { desc:'Ściąganie jedną ręką daje lepszą izolację każdej strony najszerszego. Chwyć drążek jedną ręką i ściągaj do boku klatki stabilizując tułów drugą ręką.', tips:['Stabilizuj tułów wolną ręką','Pełny zakres ruchu','Ściągaj łopatkę'], mistakes:['Rotacja tułowia','Wzruszanie barkami','Za mały zakres'] },
  'g9':  { desc:'Wiosłowanie TRX z własną masą ciała. Im bardziej poziome ciało tym trudniejsze. Ściągaj klatkę do uchwytów ściskając łopatki.', tips:['Im niżej tym trudniej','Ściągaj łopatki razem','Stabilne core przez cały czas'], mistakes:['Opadające biodra','Zbyt szybkie tempo','Brak napięcia łopatek'] },
  'g10': { desc:'Wiosłowanie odwrócone pod drążkiem z masą ciała. Leż pod drążkiem i podciągaj klatkę do drążka utrzymując ciało jak deska.', tips:['Ciało w jednej prostej linii','Ściągaj łopatki','Pełny zakres ruchu'], mistakes:['Opadające biodra','Wzruszanie barkami','Za mały zakres'] },
  'g11': { desc:'Martwy ciąg z hantlami daje większy zakres ruchu i lepszą kontrolę każdej strony. Technika identyczna jak ze sztangą — kręgosłup neutralny, biodra do tyłu.', tips:['Kręgosłup neutralny','Biodra do tyłu','Hantle blisko ciała przez cały ruch'], mistakes:['Zaokrąglone plecy','Brak napięcia core','Kolana do środka'] },
  'g12': { desc:'Martwy ciąg hex barem jest łatwiejszy dla kręgosłupa — środek ciężkości bliżej ciała. Stań w centrum hex bara, chwyć neutralnie i unieś z neutralnymi plecami.', tips:['Stań w centrum hex bara','Neutralny chwyt po bokach','Kręgosłup neutralny przez cały czas'], mistakes:['Zaokrąglone plecy','Za szeroki rozkrok','Kolana do środka'] },
  'g13': { desc:'Martwy ciąg z deficytu ze stanowiskiem na podwyższeniu zwiększa zakres ruchu. Trenuje siłę w dolnej fazie i mobilność.', tips:['Stabilne podwyższenie','Kręgosłup neutralny','Biodra nisko na starcie'], mistakes:['Zaokrąglone plecy','Zbyt duże podwyższenie','Za duże obciążenie'] },
  'g14': { desc:'Rack pull to martwy ciąg startujący z pinów na poziomie kolan lub wyżej. Pozwala użyć większego ciężaru i trenuje górną fazę martwego ciągu.', tips:['Piny na poziomie kolan lub wyżej','Napięcie przed ruchem','Eksplozywny ruch w górę'], mistakes:['Zaokrąglone plecy','Zbyt niskie piny','Brak napięcia przed ruchem'] },
  'g15': { desc:'Stiff leg deadlift z prawie prostymi nogami trenuje ścięgna podkolanowe i dolne plecy. Opuszczaj ciężar wzdłuż nóg utrzymując lekkie ugięcie kolan.', tips:['Nogi prawie proste z lekkim ugięciem','Bar blisko ciała przez cały ruch','Napięte pośladki na górze'], mistakes:['Zaokrąglone plecy','Bar za daleko od ciała','Kolana zablokowane'] },
  'g16': { desc:'Prostowanie ramion w dół angażuje najszerszy grzbiet przez izolację. Stań przy wyciągu górnym i ściągaj drążek w dół trzymając ramiona proste.', tips:['Ramiona proste przez cały ruch','Ściągaj barki do dołu','Pełny zakres ruchu'], mistakes:['Uginanie łokci','Wzruszanie barkami','Zbyt szybkie tempo'] },
  'g17': { desc:'Unoszenie tułowia na maszynie hiperekstenśji wzmacnia dolne plecy i pośladki. Kontroluj ruch i nie przegmaj za daleko w górę.', tips:['Ruch do linii bioder','Nie przeginaj za daleko','Napięcie przez cały ruch'], mistakes:['Przeginanie w górę','Zbyt szybkie tempo','Luźne pośladki'] },
  'g18': { desc:'Ściąganie Y na wyciągu angażuje dolny czworoboczny i tylne barki. Ściągaj linki z uniesionych ramion w kształt litery Y.', tips:['Ramiona uniesione na starcie','Ściągaj z łopatek','Powolny kontrolowany ruch'], mistakes:['Zbyt szybkie tempo','Ramiona za nisko','Brak zaangażowania łopatek'] },
  'g19': { desc:'Renegade row łączy plank z wiosłowaniem naprzemiennym. Z pozycji pompkowej wiosłuj naprzemiennie każdą ręką minimalizując rotację bioder.', tips:['Stabilna pozycja planku','Core napięty','Minimalne rotacje tułowia'], mistakes:['Rotacja bioder','Opadające biodra','Zbyt duże obciążenie'] },
  'g20': { desc:'Szrugi ze sztangą za plecami angażują czworoboczny inaczej niż szrugi z przodu. Sztanga trzymana za plecami, wzruszaj barkami ku górze.', tips:['Wzruszaj barkami ku górze','Nie kręć barkami','Pełne opuszczenie'], mistakes:['Kręcenie barkami','Zbyt duże obciążenie','Brak pełnego zakresu'] },

  // ── BARKI (dodatkowe) ──
  'e17': { desc:'Stój ze sztangą na obojczykach. Wyciśnij nad głowę do pełnego wyprostu ramion, kontrolowanie opuść. Fundamentalne ćwiczenie na siłę barków angażujące całe ciało.', tips:['Napnij brzuch i pośladki','Sztanga nad głową lekko za uszami','Nie wyginaj pleców'], mistakes:['Wygięcie lędźwiowe','Szarpanie ciężarem','Niepełny wyprost ramion'] },
  'e17b':{ desc:'Usiądź lub stój z hantlami na poziomie ramion. Wyciśnij nad głowę łącząc hantle. Naturalniejszy tor ruchu niż sztanga — łatwiejszy dla barków.', tips:['Łokcie lekko przed linią barków','Nie sprowadzaj hantli za nisko','Kontrolowane opuszczanie'], mistakes:['Za głębokie opuszczanie — ryzyko barku','Wygięcie pleców','Nierówne wyciśnięcie obu stron'] },
  'e17c':{ desc:'Usiądź z hantlami dłońmi do Ciebie. Wyciśnij obracając hantle tak by na górze dłonie były od Ciebie odwrócone. Angażuje wszystkie aktony barków.', tips:['Płynna rotacja nadgarstka','Nie przyśpieszaj w górze','Pełny obrót dłoni'], mistakes:['Zatrzymanie rotacji w połowie','Zbyt duży ciężar','Brak kontroli przy opuszczaniu'] },
  'e18': { desc:'Stój z hantlami po bokach. Unieś ramiona boczne do poziomu barków z łokciami lekko ugiętymi i prowadzonymi w górę. Główne ćwiczenie na boczny akton barków.', tips:['Łokcie lekko wyżej niż nadgarstki','Zatrzymaj na chwilę na górze','Powolne opuszczanie'], mistakes:['Wzruszanie barkami','Używanie rozmachu','Unoszenie zbyt wysoko'] },
  'e18b':{ desc:'Boczne unoszenie na wyciągu zapewnia stałe napięcie przez cały zakres ruchu. Chwyć uchwyt ręką po przeciwnej stronie i unoś do poziomu barku.', tips:['Stałe napięcie przez cały ruch','Nie używaj rozmachu','Możesz trzymać wolną rękę na maszynie'], mistakes:['Wychylanie tułowia','Zbyt duży ciężar','Brak kontroli opuszczania'] },
  'e19': { desc:'Pochyl tułów do 45-90° i chwyć hantle. Unoś ramiona boczne jak skrzydła z łokciami lekko ugiętymi. Angażuje tylny akton barków — kluczowe dla zdrowia barków.', tips:['Łokcie lekko ugięte','Prowadź łokcie w górę, nie nadgarstki','Zatrzymaj na górze i ściśnij łopatki'], mistakes:['Wzruszanie barkami','Zbyt szybkie tempo','Brak stabilizacji tułowia'] },
  'e19b':{ desc:'Stój z hantlami. Unoś je przed siebie do poziomu barków z kciukami lekko w górę. Angażuje przedni akton barków — ćwicz ostrożnie bo przednie aktony i tak dużo pracują.', tips:['Nie unoś wyżej niż poziom barków','Naprzemienny lub jednoczesny ruch','Powolne opuszczanie'], mistakes:['Używanie rozmachu','Zbyt wysoko unoszenie','Brak kontroli'] },
  'h1':  { desc:'Wyciskanie za głowę ze sztangą angażuje barki ale może być niebezpieczne. Wymaga bardzo dobrej mobilności. Opuszczaj tylko do poziomu uszu — nie niżej.', tips:['Tylko z doskonałą mobilnością barków','Nie schodzi poniżej uszu','Ogranicz zakres jeśli czujesz dyskomfort'], mistakes:['Schodzenie za nisko — ryzyko kontuzji barku','Zbyt duże obciążenie','Brak mobilności barków'] },
  'h2':  { desc:'Push press łączy lekki podsiad z eksplozywnym wyciskaniem barków. Pozwala użyć większego ciężaru niż przy strict press.', tips:['Lekki podsiad przed wyciskaniem','Eksplozja nóg pomocna w ruchu','Stabilne lądowanie po przyjęciu ciężaru'], mistakes:['Zbyt głęboki podsiad','Brak eksplozji','Niestabilne ramiona na górze'] },
  'h3':  { desc:'Unoszenie ramion w bok na maszynie izoluje boczną głowę barku z kontrolowanym torem ruchu i stałym napięciem.', tips:['Reguluj ramię maszyny','Łokcie na poziomie barków','Powolna ekscentryka'], mistakes:['Zła regulacja','Wzruszanie barkami','Zbyt szybki ruch'] },
  'h4':  { desc:'Wyciskanie barków w maszynie zapewnia bezpieczny tor ruchu. Usiądź, chwyć uchwyty i wyciśnij nad głowę.', tips:['Reguluj siedzisko na właściwą wysokość','Pełny zakres ruchu','Core napięty'], mistakes:['Zła regulacja siedziska','Odginanie do tyłu','Zbyt szybki ruch'] },
  'h5':  { desc:'Boczne unoszenie na wyciągu (kabel z boku) zapewnia stałe napięcie przez cały zakres ruchu — przewaga nad hantlami.', tips:['Linka za plecami lub przed ciałem','Pełny zakres ruchu','Powolna ekscentryka'], mistakes:['Wzruszanie barkami','Zbyt szybki ruch','Za duże obciążenie'] },
  'h6':  { desc:'Odwrotne rozpiętki na wyciągu angażują tylne barki i środkowe plecy. Ściągaj linki z wyciągu krzyżowego do twarzy z łokciami na poziomie barków.', tips:['Łokcie na poziomie barków','Zewnętrzna rotacja ramion na końcu','Ściągaj łopatki'], mistakes:['Łokcie za nisko','Brak rotacji zewnętrznej','Wzruszanie barkami'] },
  'h7':  { desc:'Wiosłowanie do brody ze sztangą angażuje barki i czworoboczny. Przyciągaj wąskim chwytem do brody z łokciami wyżej niż barki.', tips:['Chwyt nieco szerszy od barków','Łokcie powyżej barków','Powolny powrót'], mistakes:['Zbyt wąski chwyt — ryzyko barku','Wzruszanie barkami','Zbyt szybkie tempo'] },
  'h8':  { desc:'Wiosłowanie do brody na wyciągu z stałym napięciem. Linka od dołu przyciągana do brody.', tips:['Stałe napięcie kabla','Łokcie powyżej barków','Powolna ekscentryka'], mistakes:['Zbyt wąski chwyt','Wzruszanie barkami','Zbyt szybki ruch'] },
  'h9':  { desc:'Wznosy ramion przodem na wyciągu izolują przednie barki ze stałym napięciem przez cały ruch.', tips:['Lekkie ugięcie łokci','Nie unoś wyżej niż barki','Powolny powrót'], mistakes:['Wzruszanie barkami','Zbyt duże obciążenie','Zbyt szybki ruch'] },
  'h10': { desc:'Wyciskanie hantlami siedząc na ławce z oparciem stabilizuje tułów i izoluje pracę barków.', tips:['Pionowe oparcie','Łokcie przed linią tułowia','Pełny zakres ruchu'], mistakes:['Odginanie do tyłu','Łokcie za barkami','Zbyt szybkie tempo'] },
  'h11': { desc:'Facepull na wyciągu angażuje tylne barki i rotatory zewnętrzne. Ściągaj linę do twarzy z łokciami powyżej barków i zewnętrzną rotacją.', tips:['Łokcie powyżej barków przez cały ruch','Zewnętrzna rotacja na końcu','Ściągaj łopatki'], mistakes:['Łokcie za nisko','Brak rotacji zewnętrznej','Zbyt duże obciążenie'] },
  'h12': { desc:'Wyciskanie landmine to jednostronne wyciskanie z drąga wspartego o ścianę. Naturalny łuk ruchu dobry dla barków z kontuzjami.', tips:['Naturalny łuk ruchu','Stabilny core','Równe zaangażowanie obu stron naprzemiennie'], mistakes:['Rotacja tułowia','Brak stabilizacji','Zbyt duże obciążenie'] },
  'h13': { desc:'Viking press to unikalny sprzęt z pochwytami do wyciskania barków z naturalnym kątem. Zaznaj się ze sprzętem przed dodaniem obciążenia.', tips:['Zaznaj się ze sprzętem','Naturalne pochwyt','Pełny zakres ruchu'], mistakes:['Zbyt duże obciążenie na starcie','Odginanie do tyłu','Brak zakresu ruchu'] },

  // ── BICEPS (dodatkowe) ──
  'e20': { desc:'Stój prosto z hantlami, łokcie przy tułowiu. Ugnij łokcie unosząc hantle do barków ściskając bicepsy. Powoli opuść do pełnego wyprostu. To podstawowe ćwiczenie izolacyjne na biceps.', tips:['Trzymaj łokcie przy tułowiu','Pełny wyprost na dole każdego powtórzenia','Skup na ściskaniu bicepsa na górze'], mistakes:['Kiwanie tułowiem dla rozmachu','Łokcie odrywają się od tułowia','Zbyt szybki ruch ekscentryczny'] },
  'e21': { desc:'EZ-bar redukuje naprężenie nadgarstków dzięki zakrzywionemu kształtowi. Stój z EZ-barem podchwytem, ugnij łokcie do barków i powoli opuść.', tips:['Wygodniejszy dla nadgarstków niż prosta sztanga','Pełny wyprost ramion na dole','Nie kiwaj tułowiem'], mistakes:['Niepełny zakres ruchu','Kiwanie tułowiem','Zbyt szybkie opuszczanie'] },
  'e21b':{ desc:'Uginanie ze sztangą prostą maksymalnie angażuje długą głowę bicepsa. Trzymaj sztangę podchwytem. Pozwala na duże ciężary ale może obciążać nadgarstki.', tips:['Nadgarstek prosty przez cały ruch','Łokcie stabilne przy tułowiu','Powolna faza ekscentryczna'], mistakes:['Bóle nadgarstków — przejdź na EZ-bar','Kiwanie tułowiem','Zbyt duży ciężar'] },
  'e21c':{ desc:'Usiądź przy modlitewniku i ułóż ramię na podparciu. Ugnij łokieć unosząc hantel lub sztangę. Modlitewnik eliminuje możliwość kiwania — czysta izolacja bicepsa.', tips:['Pełny wyprost na dole — nie ucinaj zakresu','Powolne opuszczanie','Nie przeginaj nadgarstka'], mistakes:['Ucinanie zakresu ruchu','Zbyt gwałtowne szarpanie','Odrywanie łokcia od podparcia'] },
  'e21d':{ desc:'Uginanie młotkowe z hantlami z neutralnym chwytem angażuje brachialis i brachioradialis — dodaje grubości ramionom.', tips:['Kciuk w górę przez cały ruch','Łokcie przy tułowiu','Naprzemiennie lub jednocześnie'], mistakes:['Obracanie nadgarstka','Kiwanie tułowiem','Brak pełnego zakresu'] },
  'e21e':{ desc:'Uginanie na wyciągu zapewnia stałe napięcie przez cały zakres ruchu — przewaga nad hantlami szczególnie przy pełnym wyproście.', tips:['Stałe napięcie przez cały zakres','Eksperymentuj z typem uchwytu','Nie szarp linki'], mistakes:['Zbyt duży ciężar','Odrywanie łokci od tułowia','Kiwanie tułowiem'] },
  'i1':  { desc:'Uginanie na wyciągu dolnym lub górnym z stałym napięciem. Szczególnie efektywne przy pełnym wyproście gdzie hantle tracą napięcie.', tips:['Stałe napięcie kabla','Łokcie przy tułowiu','Powolna ekscentryka'], mistakes:['Kiwanie tułowia','Zbyt szybki ruch','Za mały zakres'] },
  'i2':  { desc:'Uginanie jedną ręką na wyciągu pozwala skupić się na każdej stronie osobno i wyrównać dysbalanse.', tips:['Stabilizuj tułów wolną ręką','Łokieć przy tułowiu','Pełny zakres ruchu'], mistakes:['Rotacja tułowia','Kiwanie ciałem','Za mały zakres'] },
  'i3':  { desc:'Uginanie skośne (Incline Curl) na ławce skośnej daje większy zakres ruchu i lepsze rozciągnięcie bicepsa. Ramiona zwisają za plecami.', tips:['Pełne rozciągnięcie na dole','Łokcie przy tułowiu w górze','Powolna ekscentryka'], mistakes:['Zbyt duże obciążenie','Unoszenie ramion','Zbyt szybki ruch'] },
  'i4':  { desc:'Spider curl w pozycji przodem na skośnej ławce izoluje biceps eliminując użycie pleców i tułowia.', tips:['Klatka stabilna na ławce','Łokcie zwisają swobodnie','Pełny zakres ruchu'], mistakes:['Odrywanie klatki od ławki','Zbyt szybki ruch','Za duże obciążenie'] },
  'i5':  { desc:'Uginanie skośne młotkowe łączy korzyści Incline Curl z neutralnym chwytem angażującym brachialis.', tips:['Neutralny chwyt — kciuk w górę','Pełne rozciągnięcie na dole','Powolna ekscentryka'], mistakes:['Odrywanie ramion od ławki','Zbyt szybki ruch','Za małe obciążenie'] },
  'i6':  { desc:'Uginanie siedząc eliminuje użycie nóg i tułowia. Skup się wyłącznie na izolacji bicepsa.', tips:['Plecy stabilnie na oparciu','Łokcie przy tułowiu','Pełny zakres ruchu'], mistakes:['Kiwanie tułowia','Wzruszanie barkami','Zbyt szybki ruch'] },
  'i7':  { desc:'Uginanie Bayesian przy wyciągu za ciałem daje doskonałe rozciągnięcie bicepsa w dolnym punkcie. Stań przodem od wyciągu.', tips:['Ramię za ciałem przez cały ruch','Pełne rozciągnięcie na dole','Powolna ekscentryka'], mistakes:['Ramię przed ciałem','Za mały zakres ruchu','Zbyt szybki ruch'] },
  'i8':  { desc:'Uginanie TRX z własną masą ciała na taśmach. Im bardziej pochylone ciało tym trudniejsze ćwiczenie.', tips:['Im niżej tym trudniej','Łokcie przy tułowiu','Pełny zakres ruchu'], mistakes:['Opadające biodra','Wzruszanie barkami','Za szybkie tempo'] },
  'i9':  { desc:'Uginanie na maszynie z stałym napięciem i stabilizacją eliminuje możliwość kiwania. Idealne dla izolacji i dopieczenia bicepsa.', tips:['Reguluj siedzisko','Pełny zakres ruchu','Ściskaj biceps na górze'], mistakes:['Zła regulacja siedziska','Wzruszanie barkami','Zbyt szybki ruch'] },
  'i10': { desc:'Uginanie na modlitewniku z EZ-barem — naturalny chwyt chroni nadgarstki i izoluje biceps.', tips:['Naturalne ugięcie nadgarstków z EZ','Pełne rozciągnięcie na dole','Ściskaj na górze'], mistakes:['Brak pełnego wyprostu','Zbyt szybki ruch','Za duże obciążenie'] },
  'i11': { desc:'Spider curl z EZ-barem w pozycji przodem na ławce dla pełnej izolacji bicepsa bez użycia tułowia.', tips:['Klatka stabilna na ławce','Pełny zakres ruchu','Powolna ekscentryka'], mistakes:['Odrywanie klatki','Zbyt szybki ruch','Za duże obciążenie'] },
  'i12': { desc:'Uginanie krzyżowe (Cross Body) — hantel unosi się ku przeciwległemu ramionowi. Angażuje brachialis pod nowym kątem.', tips:['Ruch ku przeciwnemu ramionowi','Łokieć przy tułowiu','Pełny zakres ruchu'], mistakes:['Rotacja tułowia','Zbyt szybkie tempo','Za duże hantle'] },
  'i13': { desc:'Uginanie ścisłe wymaga perfekcyjnej techniki bez jakiegokolwiek rozmachu. Stój plecami przy ścianie dla eliminacji kiwania.', tips:['Plecy przy ścianie','Brak użycia tułowia','Małe obciążenie z perfekcyjną techniką'], mistakes:['Jakikolwiek rozmach','Kiwanie tułowia','Zbyt duże obciążenie'] },
  'i14': { desc:'Uginanie Zottman to kombinacja — supinacja przy uginaniu i pronacja przy opuszczaniu. Ćwiczy biceps i przedramiona jednocześnie.', tips:['Supinacja dłoni w górze','Pronacja przy powolnym opuszczaniu','Powolna ekscentryka w dół'], mistakes:['Brak rotacji dłoni','Zbyt szybkie tempo','Za duże hantle'] },
  'i15': { desc:'Waiter Curl — trzymasz hantel za talerzem jak kelner niosący tacę. Angażuje biceps z neutralnym chwytem i większym zaangażowaniem brachialis.', tips:['Chwyć za zewnętrzny talerz hantli','Łokcie przy tułowiu','Pełny zakres ruchu'], mistakes:['Chwyt za uchwyt hantli','Kiwanie tułowia','Za duże hantle'] },
  'i16': { desc:'Uginanie na modlitewniku na maszynie zapewnia bezpieczny tor ruchu i stałe napięcie. Wyizolowane i skuteczne.', tips:['Reguluj siedzisko','Pełny zakres ruchu','Ściskaj biceps na górze'], mistakes:['Zła regulacja','Wzruszanie barkami','Zbyt szybki ruch'] },

  // ── TRICEPS (dodatkowe) ──
  'e22': { desc:'Stań przy wyciągu górnym, chwyć drążek lub linę. Przyciśnij łokcie do boków i wyprostuj ramiona w dół do pełnego wyprostu. Triceps odpowiada za 2/3 objętości ramienia.', tips:['Łokcie nieruchome przy tułowiu','Pełny wyprost w dolnym punkcie','Przy linie — rozciągnij ją na boki na dole'], mistakes:['Łokcie odrywają się od tułowia','Brak pełnego wyprostu','Kiwanie tułowiem'] },
  'e23': { desc:'Wyciskanie wąskim chwytem (szerokość barków) intensywnie angażuje triceps. Możesz używać dużych ciężarów budując siłę tricepsa.', tips:['Chwyć na szerokość barków — nie za wąsko','Łokcie bliżej tułowia','Pełny zakres ruchu'], mistakes:['Za wąski chwyt — bóle nadgarstków','Łokcie zbyt szeroko','Odbijanie od klatki'] },
  'e23b':{ desc:'Połóż się na ławce, chwyć EZ-bar nad głową. Zegnij łokcie opuszczając drążek ku czołu lub za głowę. Wyprostuj łokcie unosząc drążek. Angażuje długą głowę tricepsa.', tips:['Łokcie nieruchome skierowane ku sufitowi','Powolna faza ekscentryczna','Bezwzględna asekuracja'], mistakes:['Ruszanie łokciami na zewnątrz','Zbyt duży ciężar','Brak asekuracji'] },
  'e23c':{ desc:'Chwyć poręcze i podepnij się. Trzymaj tułów pionowy dla skupienia na tricepsie. Zegnij łokcie i opuść ciało kontrolowanie.', tips:['Tułów pionowy = więcej tricepsa','Pochylony = więcej klatki','Pełny zakres ruchu'], mistakes:['Zbyt gwałtowne opuszczanie','Brak pełnego wyprostu na górze','Wzruszanie barkami'] },
  'e23d':{ desc:'Pochyl się trzymając hantel. Ustabilizuj ramię przy tułowiu i wyprostuj łokieć prostując przedramię do tyłu. Izolacja długiej głowy tricepsa.', tips:['Ramię równoległe do podłogi','Pełny wyprost łokcia','Powolne kontrolowane opuszczanie'], mistakes:['Opuszczanie ramienia przy ruchu','Kiwanie tułowiem','Zbyt duży ciężar'] },
  'e23e':{ desc:'Skull crusher to French press opuszczany do czoła. Połóż się na ławce, trzymaj EZ-bar nad głową i opuszczaj do czoła zginając łokcie.', tips:['Asekuracja obowiązkowa','Łokcie skierowane ku sufitowi','Możesz też opuszczać za głowę'], mistakes:['Ruszanie łokciami na zewnątrz','Brak asekuracji','Zbyt duży ciężar'] },
  'j1':  { desc:'Prostowanie tricepsa odwróconym chwytem (dłonie do góry) angażuje długą głowę tricepsa pod innym kątem niż standardowy pushdown.', tips:['Podchwyt — dłonie ku górze','Łokcie przy tułowiu','Pełny wyprost na dole'], mistakes:['Ruszające łokcie','Wzruszanie barkami','Zbyt szybki ruch'] },
  'j2':  { desc:'Prostowanie przez ciało angażuje triceps pod unikalnym kątem. Przeprowadź ruch przez tułów ku przeciwnemu biodru.', tips:['Ruch ku przeciwnemu biodru','Łokieć stabilny','Powolna ekscentryka'], mistakes:['Ruszający łokieć','Zbyt szybki ruch','Za mały zakres'] },
  'j3':  { desc:'Prostowanie tricepsa z hantlem leżąc. Unieś hantel i zegnij łokieć opuszczając za głowę, następnie wyprostuj.', tips:['Łokieć skierowany ku sufitowi','Pełne rozciągnięcie na dole','Powolna ekscentryka'], mistakes:['Łokieć na zewnątrz','Zbyt szybki ruch','Za duże hantle'] },
  'j4':  { desc:'Prostowanie tricepsa siedząc z hantlem nad głową. Trzymaj jeden hantel obiema rękami lub jeden w każdej ręce i zegnij łokcie za głowę.', tips:['Łokcie skierowane do przodu','Pełne rozciągnięcie','Kontroluj ruch'], mistakes:['Łokcie na zewnątrz','Odginanie do tyłu','Za duże hantle'] },
  'j5':  { desc:'JM Press to kombinacja wąskiego wyciskania i French pressa. Łokcie idą ku twarzy a nie do dołu. Zaawansowane ćwiczenie na triceps.', tips:['Łokcie kieruj ku twarzy przy opuszczaniu','Powolna ekscentryka','Zaawansowane ćwiczenie — zacznij lekko'], mistakes:['Zbyt duże obciążenie na starcie','Zła trajektoria łokci','Brak asekuranta'] },
  'j6':  { desc:'Tate Press z hantlami opuszczanymi do klatki z łokciami na zewnątrz. Unikalna stymulacja tricepsa z innej strony.', tips:['Łokcie na zewnątrz','Opuszczaj hantle do klatki','Pełny wyprost ramion'], mistakes:['Łokcie przy tułowiu — to zmienia ćwiczenie','Zbyt szybki ruch','Za duże hantle'] },
  'j7':  { desc:'Dipsy na ławce z rękoma za plecami. Im dalej nogi tym trudniejsze. Angażuje triceps i przednie barki.', tips:['Ławka stabilna za plecami','Łokcie blisko siebie','Pełny zakres ruchu'], mistakes:['Zbyt głębokie opuszczanie — ból barków','Szerokie łokcie','Odpychanie nogami'] },
  'j8':  { desc:'Prostowanie tricepsa TRX z taśmami. Im bardziej poziome ciało tym trudniejsze. Doskonałe ćwiczenie kalisteniczne.', tips:['Im niżej tym trudniej','Łokcie przy tułowiu','Pełny wyprost ramion'], mistakes:['Opadające biodra','Zbyt szybkie tempo','Asymetria rąk'] },
  'j9':  { desc:'Prostowanie tricepsa nad głową na wyciągu angażuje długą głowę tricepsa w maksymalnym rozciągnięciu.', tips:['Opuść linkę za głowę','Łokcie przy uszach','Powolna ekscentryka'], mistakes:['Łokcie na zewnątrz','Wzruszanie barkami','Zbyt szybki ruch'] },
  'j10': { desc:'Prostowanie tricepsa leżąc ze sztangą to French press na ławce. Pełne rozciągnięcie tricepsa.', tips:['Łokcie skierowane ku sufitowi','Opuszczaj do czoła lub za głowę','Powolna ekscentryka'], mistakes:['Łokcie na zewnątrz','Zbyt szybki ruch','Zbyt duże obciążenie'] },

  // ── NOGI (dodatkowe) ──
  'e11': { desc:'Stań pod sztangą na górnych mięśniach pleców. Zejdź kontrolowanie z biodrami i kolanami do momentu gdy uda są równoległe lub niżej. Wstań siłą nóg. Królowa ćwiczeń siłowych.', tips:['Kolana w kierunku palców stóp','Pięty całe na podłodze','Wciągnij brzuch i napnij core przed każdym powtórzeniem'], mistakes:['Kolana opadają do środka (valgus)','Pięty unoszą się od podłogi','Zaokrąglone plecy'] },
  'e11b':{ desc:'Przysiad przedni ze sztangą trzymaną przed szyją. Bardziej pionowy tułów i większe zaangażowanie czworogłowych niż w przysiądzie tylnym. Trudniejszy technicznie.', tips:['Łokcie wysokie — nie opuszczaj ich','Kolana ku przodowi','Wymaga dobrej ruchomości nadgarstków'], mistakes:['Opadanie łokci — sztanga spada','Zbyt pochylony tułów','Brak ruchomości nadgarstka'] },
  'e11c':{ desc:'Trzymaj kettlebell lub hantel przy klatce pionowo i zejdź w głęboki przysiad. Doskonałe ćwiczenie techniczne bezpieczne dla kręgosłupa.', tips:['Ciężar blisko ciała','Pięty na podłodze przez cały czas','Głęboki przysiad uczy prawidłowego wzorca'], mistakes:['Opadanie kolan do środka','Pięty unoszą się','Za mały zakres ruchu'] },
  'e12': { desc:'Stój z hantlami, wykonaj duży krok do przodu i opuść tylne kolano blisko podłogi. Wróć do pozycji. Angażuje czworogłowe, pośladki i ścięgna.', tips:['Krok wystarczająco duży','Przednie kolano nie wychodzi za palce','Tułów pionowy'], mistakes:['Kolano przednie wychodzi za palce','Za mały krok','Kiwanie tułowiem'] },
  'e12b':{ desc:'Tylna noga uniesiona na ławce, przednia z przodu. Zegnij kolano przedniej nogi schodząc w dół. Doskonałe jednostronne ćwiczenie na nogi i pośladki.', tips:['Ławka na odpowiedniej wysokości','Krok wystarczająco duży do przodu','Tułów lekko do przodu'], mistakes:['Kolano opada do środka','Za mały krok — obciążenie na ławce','Wychylanie tułowia do tyłu'] },
  'e12c':{ desc:'Wykroki w ruchu — każdy krok to jedno powtórzenie. Dobra kombinacja cardio i treningu nóg. Wymaga przestrzeni.', tips:['Równomierny rytm','Duże kroki dla lepszego zakresu','Tułów pionowy przez cały czas'], mistakes:['Zbyt małe kroki','Pośpiech kosztem techniki','Kolana do środka'] },
  'e13': { desc:'Usiądź na maszynie z stopami pod walcem. Wyprostuj nogi do pełnego wyprostu, zatrzymaj na 1-2 sekundy, powoli opuść. Izolacja czworogłowych.', tips:['Zatrzymaj na górze dla maksymalnej aktywacji','Powolne opuszczanie','Oś kolana w linii z osią maszyny'], mistakes:['Jako jedyne ćwiczenie na nogi','Brak pełnego wyprostu','Gwałtowne opuszczanie'] },
  'e14': { desc:'Leż na maszynie twarzą w dół z stopami pod walcem. Ugnij kolana przyciągając walec ku pośladkom. Izolacja mięśni dwugłowych ud.', tips:['Pełny zakres ruchu','Zatrzymaj na górze','Nie unoś bioder'], mistakes:['Unoszenie bioder','Zbyt szybkie tempo','Brak pełnego wyprostu na dole'] },
  'e14b':{ desc:'Siedzący wariant uginania nóg. Pozycja siedząca mocniej rozciąga dwugłowe uda. Ten sam cel co wersja leżąca.', tips:['Plecy na oparciu przez cały czas','Pełny zakres ruchu','Powolna faza ekscentryczna'], mistakes:['Odrywanie pleców od oparcia','Brak pełnego wyprostu','Za szybkie tempo'] },
  'e14c':{ desc:'Stój ze sztangą na ramionach lub bez. Pochyl tułów do przodu utrzymując nogi prawie wyprostowane. Doskonałe na ścięgna podkolanowe i dolne plecy.', tips:['Neutralny kręgosłup przez cały ruch','Poczuj rozciągnięcie ścięgien','Biodra do tyłu, nie plecy w dół'], mistakes:['Zaokrąglone plecy','Zbyt głęboki skłon','Zbyt duże ugięcie kolan'] },
  'k1':  { desc:'Przysiad bułgarski ze sztangą. Tylna noga na ławce, sztanga na barkach. Wymagające technicznie ale bardzo skuteczne na nogi i pośladki.', tips:['Krok wystarczająco duży do przodu','Sztanga stabilna na barkach','Tułów lekko do przodu'], mistakes:['Za blisko ławki — obciążenie na tylnej nodze','Kolano wysuwa się za palce','Zaokrąglone plecy'] },
  'k2':  { desc:'Przysiad bułgarski w suwnicy Smitha daje stabilniejszy tor ruchu. Dobra opcja do nauki ruchu przed przejściem na wolne ciężary.', tips:['Tylna noga na ławce','Pełny zakres ruchu','Tułów pionowy lub lekko do przodu'], mistakes:['Za blisko Smitha','Kolano wysuwa się','Zbyt duże obciążenie'] },
  'k3':  { desc:'Przysiad sumo z szerokim rozstawem stóp i palcami na zewnątrz. Angażuje mocniej przyśrodkowe mięśnie uda i pośladki. Dobry wariant urozmaicający trening nóg.', tips:['Stopy szeroko, palce na zewnątrz','Kolana nad palcami przez cały czas','Tułów pionowy'], mistakes:['Kolana do środka','Zaokrąglone plecy','Za mały zakres ruchu'] },
  'k4':  { desc:'Przysiad z pauzą uczy prawidłowego napięcia dolnej fazy i eliminuje moment pędu. Pauza 2-3 sekundy na dole.', tips:['Pauza 2-3 sekundy na dole','Napięcie mięśni podczas pauzy','Eksplozywny ruch w górę'], mistakes:['Relaksowanie mięśni w pauzie','Zbyt krótka pauza','Za duże obciążenie'] },
  'k5':  { desc:'Przysiad na skrzyni trenuje dolną fazę. Siądź na skrzyni kontrolowanie, pauza i eksplozja w górę. Uczy prawidłowej głębokości przysiadowej.', tips:['Siądziesz kontrolowanie — nie plumping','Stopy płasko na podłodze','Eksplozja w górę po pauzie'], mistakes:['Plumping na skrzynię','Zbyt wysoka skrzynka','Brak eksplozji'] },
  'k6':  { desc:'Przysiad pistol jednonóż to zaawansowane ćwiczenie wymagające siły i mobilności. Długa progresja przez tygodnie i miesiące.', tips:['Zacznij od asysty (TRX lub poręcz)','Progresja przez wiele tygodni','Pełna mobilność bioder i kostek wymagana'], mistakes:['Za wczesna próba bez asysty','Brak mobilności','Opadające kolano'] },
  'k7':  { desc:'Przysiad sissy z wychyleniem tułowia do tyłu i uniesieniem się na palce angażuje intensywnie czworogłowe. Wymaga przyzwyczajenia kolan.', tips:['Zacznij z małym zakresem','Trzymaj się czegoś dla stabilności','Stopniowo zwiększaj zakres'], mistakes:['Zbyt głęboki zakres na starcie','Brak podparcia','Ból kolan — wzmocnij je najpierw'] },
  'k8':  { desc:'Wchodzenie na skrzynię angażuje czworogłowe i pośladki jednostronnie. Wejdź na skrzynię pracując z przedniej nogi. Nie odpychaj się tylną.', tips:['Cała stopa na skrzyni','Pracuj z przedniej nogi','Pełny wyprost na górze'], mistakes:['Odpychanie tylną nogą','Zbyt wysoka skrzynka','Brak pełnego wyprostowania'] },
  'k9':  { desc:'Wyskok na skrzynię trenuje eksplozywną moc nóg. Wyskocz i ląduj z ugiętymi kolanami i biodrami absorbując siłę.', tips:['Miękkie lądowanie','Zeskocz kontrolowanie (nie skacz w tył)','Zacznij od niskiej skrzynki'], mistakes:['Twarde lądowanie — ryzyko kontuzji','Zbyt wysoka skrzynka na starcie','Brak kontroli przy zeskoku'] },
  'k10': { desc:'Norski curl angażuje ekscentrycznie mięśnie dwugłowe uda. Klęcząc z zapiętymi kostkami powoli opuszczaj ciało ku przodowi.', tips:['Klęcząc z zapiętymi kostkami','Bardzo powolne opuszczanie','Użyj rąk do powrotu na początku'], mistakes:['Zbyt szybkie opuszczanie','Zbyt wczesna próba pełnej wersji','Brak asekuracji przy opuszczaniu'] },
  'k11': { desc:'Uginanie nóg stojąc na maszynie lub z hantlem angażuje dwugłowe uda w pozycji stojącej.', tips:['Stabilna pozycja stojąca','Pełny zakres ruchu','Powolna ekscentryka'], mistakes:['Kiwanie tułowia','Zbyt szybki ruch','Za duże obciążenie'] },
  'k12': { desc:'Uginanie jednonóż leżąc izoluje każdą nogę osobno i pomaga wyrównać dysbalanse.', tips:['Reguluj poduszkę maszyny','Pełny zakres ruchu','Powolna ekscentryka'], mistakes:['Unoszenie bioder','Zbyt szybki ruch','Za mały zakres'] },
  'k13': { desc:'Glute ham raise na specjalnej maszynie angażuje pośladki i dwugłowe uda. Opuść się i unieś tułów siłą tylnych ud.', tips:['Kontrolowane opuszczanie','Eksplozywny powrót','Napięte pośladki na górze'], mistakes:['Zbyt szybkie opuszczanie','Brak asekuracji na starcie','Za duże obciążenie'] },
  'k14': { desc:'Przysiad plie z szeroko rozstawionymi stopami i palcami na zewnątrz. Angażuje przyśrodkowe mięśnie uda i pośladki.', tips:['Palce na zewnątrz','Kolana nad palcami','Tułów pionowy'], mistakes:['Kolana do środka','Zaokrąglone plecy','Za mały zakres'] },
  'k15': { desc:'Wykroki chodzące w ruchu angażują czworogłowe i pośladki dynamicznie. Każdy krok to jedno powtórzenie naprzemiennie.', tips:['Długie kroki','Tylne kolano blisko podłogi','Tułów pionowy przez cały czas'], mistakes:['Za krótkie kroki','Brak kontroli','Zbyt szybkie tempo'] },
  'k16': { desc:'Wykroki ze sztangą na barkach to trudniejsza wersja angażująca więcej mięśni stabilizatorów.', tips:['Sztanga stabilna na barkach','Długie kroki','Tułów pionowy'], mistakes:['Zaokrąglone plecy','Za krótkie kroki','Kolana do środka'] },
  'k17': { desc:'Przysiad z hantlami wzdłuż boków to łatwiejsza wersja przysiadu bez dużego obciążenia kręgosłupa.', tips:['Hantle wzdłuż boków','Kolana ku palcom','Tułów lekko do przodu'], mistakes:['Kolana do środka','Zaokrąglone plecy','Za mały zakres'] },

  // ── POŚLADKI (dodatkowe) ──
  'e16': { desc:'Połóż górne plecy na ławce ze sztangą na biodrach. Unieś biodra do pełnego wyprostu ściskając pośladki mocno. Powoli opuść. Najskuteczniejsze ćwiczenie na pośladki.', tips:['Ściskaj pośladki mocno na górze','Broda do klatki — patrz przed siebie','Stopy tak by kolana były pod kątem 90° na górze'], mistakes:['Brak pełnego wyprostu bioder','Wygięcie lędźwiowe zamiast pchania biodrami','Stopy zbyt daleko lub za blisko'] },
  'e16b':{ desc:'Technicznie identyczny z hip thrustem ze sztangą, ale hantel łatwiej kontrolować. Dobry dla początkujących lub jako lżejsza opcja.', tips:['Hantel na biodrach stabilnie','Pełny wyprost bioder na górze','Powolna faza ekscentryczna'], mistakes:['Hantel zjeżdża z bioder','Brak pełnego wyprostu','Stopy za daleko od pośladków'] },
  'e16c':{ desc:'Usiądź na maszynie z podkładkami na zewnętrznej części kolan. Odpychaj kolana na zewnątrz. Angażuje pośladki średnie i małe odpowiedzialne za stabilność.', tips:['Siedź prosto z plecami na oparciu','Pełny zakres ruchu','Powolna ekscentryka'], mistakes:['Zbyt szybkie tempo','Odrywanie pleców od oparcia','Zbyt mały zakres'] },
  'e16d':{ desc:'Połóż się na plecach ze stopami na podłodze. Unoś biodra do pełnego wyprostu ściskając pośladki. Dobra aktywacja pośladków i wersja dla początkujących.', tips:['Pełny wyprost i ściskanie na górze','Stopy tak by kolana były proste na górze','Można jedną nogą dla trudniejszej wersji'], mistakes:['Brak pełnego wyprostu','Wygięcie pleców zamiast pchania biodrami','Brak napięcia pośladków'] },
  'e16e':{ desc:'Na czworakach unoś jedną nogę ugiętą pod kątem 90° ku górze i do tyłu. Prosta izolacja pośladka wielkiego.', tips:['Trzymaj kolano ugięte pod kątem 90°','Ściśnij pośladek na górze','Plecy neutralne — nie wyginaj lędźwi'], mistakes:['Wygięcie lędźwi zamiast ruchu w biodrze','Brak ściśnięcia na górze','Niestabilne ramiona'] },
  'k24': { desc:'Leż na boku z ugiętymi kolanami i stopami złączonymi. Otwieraj górne kolano jak muszla. Angażuje pośladek średni — ważny dla stabilności bioder.', tips:['Stopy złączone przez cały ruch','Pełny zakres otwarcia','Ściśnij pośladek na górze'], mistakes:['Rotacja bioder','Za mały zakres otwarcia','Zbyt szybkie tempo'] },
  'k25': { desc:'Stój przy wyciągu dolnym z opaską na kostce. Odwodź nogo do boku utrzymując pionowy tułów.', tips:['Stabilna pozycja stojąca','Unoś nogę kontrolowanie do boku','Ściśnij pośladek na górze'], mistakes:['Przechylanie tułowia','Za szybkie tempo','Za duże obciążenie'] },
  'l1':  { desc:'Mostek biodrowy jednonóż — jeden noga na podłodze, druga uniesiona. Izoluje każdy pośladek osobno i wymaga stabilizacji core.', tips:['Jedna noga uniesiona','Ściśnij pośladek pracującej nogi','Pełny wyprost bioder'], mistakes:['Opadające biodro niestabilnej strony','Za mały zakres','Zbyt szybkie tempo'] },
  'l2':  { desc:'Mostek biodrowy ze sztangą z podkładką na biodrach. Wersja z dodatkowym obciążeniem dla lepszej progresji.', tips:['Podkładka ochronna na biodrach','Pełny wyprost bioder na górze','Ściśnij pośladki'], mistakes:['Wygięcie lędźwiowe','Odrywające się pięty','Za duże obciążenie na starcie'] },
  'l3':  { desc:'Kopnięcia tyłem na wyciągu z opaską na kostce. Stój przy wyciągu i odsuwaj nogę do tyłu i ku górze ściskając pośladek.', tips:['Stój stabilnie przy wyciągu','Unoś nogę do tyłu i ku górze','Ściśnij pośladek na górze'], mistakes:['Przechylanie tułowia','Za szybkie tempo','Za duże obciążenie'] },
  'l4':  { desc:'Kopnięcia tyłem na maszynie z kontrolowanym torem ruchu. Reguluj opór i kąt dla optymalnej aktywacji pośladków.', tips:['Reguluj maszynę','Pełny zakres ruchu','Ściśnij pośladek na górze'], mistakes:['Zła regulacja','Za szybkie tempo','Za duże obciążenie'] },
  'l5':  { desc:'Przeciągnięcie na wyciągu (cable pull through) angażuje pośladki i ścięgna podkolanowe ruchem biodrowym (hip hinge). Stój tyłem do wyciągu.', tips:['Stań tyłem do wyciągu','Biodra do tyłu — ruch biodrowy nie przysiad','Pełny wyprost bioder na górze z napięciem pośladków'], mistakes:['Przysiad zamiast hip hinge','Za małe cofnięcie bioder','Zbyt szybki ruch'] },

  // ── BRZUCH (dodatkowe) ──
  'e24': { desc:'Przyjmij pozycję na przedramionach z ciałem w jednej prostej linii. Utrzymaj jak najdłużej napinając cały core. Fundament zdrowia kręgosłupa.', tips:['Biodra w linii ciała','Wciągnij brzuch i napnij pośladki','Oddychaj równomiernie nie zatrzymuj oddechu'], mistakes:['Biodra za wysoko — za łatwe','Biodra opadają — brak siły','Wstrzymywanie oddechu'] },
  'e25': { desc:'Połóż się z kolanami ugiętymi. Unoś barki od podłogi ściskając brzuch. Opuść kontrolowanie. To ruch krótki — nie robisz pełnego sit-upa.', tips:['Ręce przy uszach lub na klatce','Wzrok ku sufitowi','Powolne opuszczanie'], mistakes:['Ciągnięcie za szyję rękami','Szybkie kiwanie','Pełny sit-up zamiast crunch'] },
  'e25b':{ desc:'Usiądź przy maszynie i chwyć uchwyt. Zegnij tułów ku kolanom ściskając brzuch. Pozwala na progresję z obciążeniem.', tips:['Skup na ściskaniu brzucha — nie ciągnij szyją','Pełny zakres ruchu','Powolna faza ekscentryczna'], mistakes:['Używanie ramion zamiast brzucha','Zbyt szybkie tempo','Zbyt duży ciężar kosztem techniki'] },
  'e26': { desc:'Zawis na drążku i unoś nogi do poziomu bioder lub wyżej. Angażuje cały brzuch szczególnie dolne partie. Zaawansowane ćwiczenie.', tips:['Zacznij od uginania kolan jeśli za trudne','Kontrolowany ruch bez kiwania','Oddychaj w rytm ruchu'], mistakes:['Kiwanie tułowiem dla rozmachu','Brak kontroli przy opuszczaniu','Zbyt szybkie tempo'] },
  'e26b':{ desc:'Połóż się na plecach z rękami pod pośladkami. Unoś wyprostowane nogi do 45-90° i powoli opuść. Angażuje dolny brzuch.', tips:['Dolny odcinek pleców przy podłodze','Kontroluj opuszczanie','Ugięte kolana — łatwiejsza wersja'], mistakes:['Unoszenie pleców od podłogi','Zbyt szybkie tempo','Trzymanie oddechu'] },
  'e26c':{ desc:'Usiądź z lekko uniesionymi stopami. Skręcaj tułów raz w lewo raz w prawo. Angażuje skośne mięśnie brzucha. Można z piłką lub hantlem.', tips:['Plecy lekko pochylone do tyłu','Skręcaj tułów — nie tylko ramiona','Stopy uniesione dla trudniejszej wersji'], mistakes:['Skręcanie tylko ramionami','Opadanie nóg','Zbyt szybkie tempo'] },
  'e26d':{ desc:'Naprzemiennie łokieć do kolana w ruchu naśladującym jazdę na rowerze. Angażuje cały brzuch i skośne.', tips:['Pełny skręt tułowia','Kolano naprawdę dochodzi do łokcia','Powolne kontrolowane tempo'], mistakes:['Tylko ruch ramionami bez skrętu','Zbyt szybkie kiwanie','Brak pełnego wyprostu wysuwanej nogi'] },
  'e26e':{ desc:'Klęcz za kółkiem ab wheel. Tocz do przodu utrzymując proste plecy, wróć. Ekstremalnie efektywne na core. Wymaga dużej siły.', tips:['Zacznij od krótkiego zakresu','Napnij brzuch i pośladki','Nie opuszczaj bioder przy ruchu do przodu'], mistakes:['Zbyt długi zakres na początku','Wygięcie lędźwiowe','Opadanie bioder'] },
  'e26f':{ desc:'Pozycja boczna na przedramieniu i stopach. Utrzymuj ciało w linii bocznej. Angażuje mięśnie skośne i stabilizatory.', tips:['Biodra nie opadają','Napnij skośne brzucha','Można unosić wolną rękę lub nogę'], mistakes:['Opadanie bioder','Wstrzymywanie oddechu','Brak napięcia core'] },
  'e26g':{ desc:'Klęcz lub stój przy wyciągu górnym z liną. Zegnij tułów ściskając brzuch. Pozwala na progresywne obciążenie brzucha.', tips:['Ruch w talii — nie w biodrach','Skup się na ściskaniu brzucha','Pełny zakres ruchu'], mistakes:['Ciągnięcie ramionami','Ruch w biodrach zamiast w kręgosłupie','Za duży ciężar'] },
  'm1':  { desc:'Usiądź na maszynie rotacyjnej i obracaj tułów na boki. Angażuje mięśnie skośne brzucha z kontrolowanym oporem.', tips:['Reguluj siedzisko','Pełna rotacja','Powolne kontrolowane tempo'], mistakes:['Zła regulacja','Za szybki ruch','Zbyt duże obciążenie'] },
  'm2':  { desc:'Stój przy wyciągu górnym z liną i ściągaj ku podłodze zaginając w talii. Angażuje brzuch w pozycji stojącej.', tips:['Stałe napięcie kabla','Giń w talii — nie w biodrach','Powolny ruch'], mistakes:['Ruch w biodrach zamiast w talii','Zbyt szybkie tempo','Za duże obciążenie'] },
  'm3':  { desc:'Zwis na drążku z ugiętymi kolanami przyciąganymi ku klatce. Łatwiejsze niż leg raise z wyprostowanymi nogami.', tips:['Mocny chwyt na drążku','Kontroluj huśtanie','Unoś kolana do klatki piersiowej'], mistakes:['Kiwanie tułowiem','Zbyt szybkie tempo','Brak kontroli przy opuszczaniu'] },
  'm4':  { desc:'Leż i naprzemiennie krzyżuj wyprostowane nogi blisko podłogi (flutter kicks). Angażuje cały brzuch i mięśnie biodrowe.', tips:['Dolne plecy przy podłodze','Małe nożycowe ruchy','Napięty core przez cały czas'], mistakes:['Unoszenie dolnych pleców','Zbyt szybkie tempo','Brak napięcia core'] },
  'm5':  { desc:'W pozycji planku naprzemiennie przyciągaj kolana do klatki. Łączy cardio z pracą core. Tempo zależne od celu.', tips:['Stabilna pozycja planku','Szybkie tempo na cardio','Napięty core przez cały czas'], mistakes:['Opadające biodra','Skakanie zamiast biegu','Brak stabilizacji barków'] },
  'm6':  { desc:'Wiszą na drążku z uniesionymi nogami obracaj nimi na boki jak wycieraczkami. Zaawansowane ćwiczenie na boczne partie brzucha.', tips:['Mocny chwyt','Proste nogi jeśli możliwe','Kontrolowane ruchy na boki'], mistakes:['Zbyt szybki ruch — siłą bezwładności','Brak kontroli','Niewystarczająca siła bazowa'] },
  'm7':  { desc:'W zwisie unieś proste nogi i dotknij nimi drążka ponad rękami. Wymaga siły core i mobilności. Bardzo zaawansowane.', tips:['Mocny chwyt na drążku','Proste nogi jeśli możliwe','Kontroluj huśtanie'], mistakes:['Kiwanie tułowiem','Brak wystarczającej siły core','Zbyt szybkie tempo'] },
  'm8':  { desc:'Dragon flag to leżąc na ławce z ciałem uniesionym prostopadle do barków na dole. Wymaga ogromnej siły core. Bruce Lee to popularyzował.', tips:['Długa progresja wymagana','Zacznij od ugiętych kolan','Napięcie całego ciała'], mistakes:['Za wczesna próba pełnej wersji','Brak kontroli przy opuszczaniu','Opadające biodra'] },
  'm9':  { desc:'Spięcia boczne angażują mięśnie skośne brzucha. Leż na boku i unoś barki ku górze lub pochylaj ze stojąc z hantlem.', tips:['Kontrolowany ruch na bok','Nie pochylaj do przodu','Obie strony równo'], mistakes:['Pochylanie do przodu','Zbyt szybkie tempo','Tylko jedna strona'] },
  'm10': { desc:'Spięcia podwójne łączą unoszenie barków i nóg jednocześnie ku środkowi ciała. Pełna aktywacja brzucha.', tips:['Jednoczesne unoszenie','Spotykaj ręce i nogi w środku','Kontroluj powrót'], mistakes:['Zbyt szybkie tempo','Brak synchronizacji','Za mały zakres'] },
  'm11': { desc:'Plank wysoki na wyprostowanych rękach. Trudniejszy niż na przedramionach dla mięśni stabilizujących bark.', tips:['Ręce pod barkami','Prosta linia od głowy do pięt','Oddychaj miarowo'], mistakes:['Opadające biodra','Uniesiona góra tułowia','Zatrzymanie oddechu'] },
  'm12': { desc:'Plank odwrócony na przedramionach z brzuchem ku górze angażuje mięśnie przykręgosłupowe i pośladki.', tips:['Biodra wysoko','Prosta linia od głowy do stóp','Napięte pośladki'], mistakes:['Opadające biodra','Zbyt krótki czas','Zapomnij o reszcie ciała'] },
  'm13': { desc:'Nożyce pionowe to naprzemienne unoszenie nóg w pionie. Angażuje dolny brzuch i mięśnie biodrowe.', tips:['Dolne plecy przy podłodze','Kontrolowany ruch','Małe amplitudy'], mistakes:['Unoszenie dolnych pleców','Zbyt szybkie tempo','Brak napięcia core'] },
  'm14': { desc:'Spięcia na ławce skośnej z głową niżej dają większy zakres ruchu dla brzucha niż na płaskiej podłodze.', tips:['Bezpieczne oparcie nóg','Pełny zakres ruchu','Ściskaj brzuch w górze'], mistakes:['Zbyt szybkie tempo','Ciągnięcie za szyję','Brak pełnego zakresu'] },
  'm15': { desc:'Pełny sit-up na ławce skośnej z głową niżej. Większy zakres niż crunch, angażuje mięśnie biodrowe.', tips:['Bezpieczne oparcie nóg','Pełny zakres — do pionu','Ręce lekko przy głowie'], mistakes:['Ciągnięcie za szyję','Zbyt szybkie tempo','Brak pełnego wyprostu'] },
  'n1':  { desc:'Rwanie olimpijskie to podnoszenie sztangi nad głowę jednym eksplozywnym ruchem. Wymaga doskonałej techniki i trenera. Król ćwiczeń olimpijskich.', tips:['Ucz się od certyfikowanego trenera','Zacznij od pustej sztangi','Elastyczność barków i kostek kluczowa'], mistakes:['Brak techniki — kontuzja gwarantowana','Zbyt duże obciążenie na starcie','Niedostateczna mobilność'] },
  'n2':  { desc:'Dwubój olimpijski składa się z zarzutu i wyciskania. Najkompleksowsze ćwiczenie siłowe wymagające trenera i lat praktyki.', tips:['Zawsze z trenerem na początku','Progresja od podstaw przez wiele miesięcy','Skupiaj się na technice nie obciążeniu'], mistakes:['Łączenie bez opanowania każdej fazy','Zbyt duże obciążenie','Brak rozgrzewki'] },
  'n3':  { desc:'Power clean to uproszczona wersja zarzutu bez pełnego przysiadu pod sztangą. Eksplozywne podniesienie sztangi na barki.', tips:['Eksplozja bioder w górnej fazie','Szybkie podsiady pod sztangę','Bar blisko ciała przez cały czas'], mistakes:['Brak eksplozji bioder','Bar zbyt daleko od ciała','Zbyt wolne podsiady'] },
  'n4':  { desc:'Zarzut z podwieszenia startuje ze sztangą na poziomie kolan. Trenuje eksplozywność bioder i fazę wychwytową na barkach.', tips:['Sztanga na poziomie kolan na starcie','Eksplozja bioder ku górze','Szybkie podsiady pod sztangę'], mistakes:['Bar za daleko od ciała','Brak eksplozji bioder','Zbyt wolne podsiady'] },
  'n5':  { desc:'Thruster łączy przysiad z wyciskaniem nad głowę jednym ruchem. Kompleksowe ćwiczenie angażujące całe ciało. Popularne w CrossFit.', tips:['Eksplozja z przysiadu do wyciskania','Płynne przejście bez pauzy','Stabilne core przez cały ruch'], mistakes:['Brak synergii między przysiadem a wyciskaniem','Zbyt duże obciążenie','Zaokrąglone plecy'] },
  'n6':  { desc:'Swing kettlebell angażuje pośladki i ścięgna podkolanowe eksplozywnym ruchem biodrowym. To nie przysiad — to ruch bioder (hip hinge).', tips:['Eksplozja bioder w górnej fazie','Nie kucaj — ruch bioder nie kolan','Napięte pośladki i core na górze'], mistakes:['Kucanie zamiast hip hinge','Brak eksplozji bioder','Unoszenie kettlebell siłą ramion'] },

  // ── ŁYDKI (dodatkowe) ──
  'e15': { desc:'Stań na krawędzi podwyższenia z pętami w powietrzu. Wejdź na palce jak najwyżej, zatrzymaj 1-2 sekundy, powoli opuść poniżej poziomu podwyższenia. Pełny zakres jest kluczowy.', tips:['Pełny zakres — też rozciągnięcie na dole','Zatrzymaj na górze 1-2 sek','Nie biegnij przez powtórzenia'], mistakes:['Brak pełnego zakresu','Zbyt szybkie tempo','Uginanie kolan'] },
  'e15b':{ desc:'Siedząc na maszynie z ciężarem na kolanach unoś pięty jak najwyżej. Angażuje głębszy mięsień łydki (soleus) bardziej niż wersja stojąca.', tips:['Inne mięśnie niż w wersji stojącej','Pełny zakres ruchu','Powolna ekscentryka'], mistakes:['Zbyt szybkie tempo','Brak pełnego zakresu','Za duży ciężar'] },
  'e15c':{ desc:'Skakanka to znakomite cardio angażujące łydki, koordynację i wytrzymałość. Zacznij od 30-60 sekund i stopniowo zwiększaj.', tips:['Skacz na palcach — nie na całej stopie','Nadgarstki kręcą skakankę — nie ramiona','Ląduj miękko'], mistakes:['Skakanie na całej stopie','Zbyt wysokie skakanie','Zbyt szybkie tempo na początku'] },
  'k18': { desc:'Wznosy łydek jednonóż siedząc izolują każdą łydkę osobno. Pomagają wykryć i wyrównać dysbalanse między nogami.', tips:['Jedna noga na maszynie','Pełny zakres ruchu','Powolna ekscentryka'], mistakes:['Kompensacja drugą nogą','Za mały zakres','Za szybkie tempo'] },
  'k19': { desc:'Wznosy łydek na maszynie hack squat z lekko ugiętymi kolanami angażują łydki pod innym kątem.', tips:['Stopy na krawędzi platformy','Pełny zakres ruchu','Powolna ekscentryka'], mistakes:['Za mały zakres','Za szybkie tempo','Brak opuszczenia poniżej poziomu'] },
  'k20': { desc:'Prasa łydek na maszynie prasy nóg. Wciśnij platformę palcami stóp i unoś na palce.', tips:['Palce stóp na krawędzi','Pełny zakres ruchu','Powolna ekscentryka'], mistakes:['Za mały zakres','Za szybkie tempo','Brak opuszczenia'] },
  'k21': { desc:'Wznosy łydek ze sztangą na barkach na podwyższeniu. Wymaga dobrego balansu i stabilności.', tips:['Sztanga stabilna na barkach','Podwyższenie pod palcami','Pełny zakres ruchu'], mistakes:['Za mały zakres','Zbyt szybkie tempo','Niestabilna sztanga'] },

  // ── PRZEDRAMIONA ──
  'e27': { desc:'Siedź z łokciami na kolanach i uginaj nadgarstki ku górze trzymając hantle podchwytem. Wzmacnia zginacze przedramienia.', tips:['Łokcie stabilne na kolanach','Pełny zakres ruchu','Powolna ekscentryka'], mistakes:['Ruszające łokcie','Za szybkie tempo','Zbyt duże hantle'] },
  'e27b':{ desc:'Identyczny ruch co wrist curl ale z chwytem odwróconym (grzbiet dłoni w górę). Angażuje prostowniki nadgarstka — mniej używane w treningu.', tips:['Lżejszy ciężar niż przy podchwycie','Pełny zakres ruchu','Dobry suplement do treningu bicepsa'], mistakes:['Za duży ciężar','Zbyt szybkie tempo','Uginanie łokcia'] },
  'e27c':{ desc:'Chwyć ciężkie hantle lub kettlebell i idź. Angażuje chwyt, przedramiona, czworoboczny i core. Jedno z najlepszych ćwiczeń funkcjonalnych.', tips:['Plecy proste i barki cofnięte','Chroń barki — ściągnięte łopatki','Zacznij od 20-30 metrów'], mistakes:['Garbienie się','Zbyt lekki ciężar','Zbyt wolny krok'] },

};

// ── Mapa muscle keys → polskie nazwy ──
var MUSCLE_LABELS = {
  chest:         'Klatka piersiowa',
  lats:          'Najszerszy grzbiet',
  upperBack:     'Górne plecy',
  lowerBack:     'Dolne plecy',
  traps:         'Czworoboczny',
  frontShoulder: 'Barki przednie',
  midShoulder:   'Barki boczne',
  rearShoulder:  'Barki tylne',
  biceps:        'Biceps',
  triceps:       'Triceps',
  forearms:      'Przedramiona',
  abs:           'Brzuch / Core',
  quads:         'Czworogłowe uda',
  hamstrings:    'Dwugłowe uda',
  glutes:        'Pośladki',
  calves:        'Łydki',
};

var LEVEL_BADGES = {
  'łatwy':        { emoji:'🟢', label:'Łatwe' },
  'średni':       { emoji:'🟡', label:'Średnie' },
  'zaawansowany': { emoji:'🔴', label:'Trudne' },
};

// ── Pobierz historię ćwiczenia ──
function getExerciseHistory(exId) {
  var history = [];
  state.workouts.forEach(function(w) {
    (w.exercises||[]).forEach(function(ex) {
      if (ex.id !== exId) return;
      var doneSets = (ex.sets||[]).filter(function(s){ return s.done; });
      if (!doneSets.length) return;
      var maxW = Math.max.apply(null, doneSets.map(function(s){ return parseFloat(s.weight)||0; }));
      var maxR = Math.max.apply(null, doneSets.map(function(s){ return parseInt(s.reps)||0; }));
      var e1rm = maxW * (1 + maxR/30);
      history.push({ date: w.date, sets: doneSets.length, maxWeight: maxW, maxReps: maxR, e1rm: e1rm });
    });
  });
  history.sort(function(a,b){ return new Date(b.date)-new Date(a.date); });
  return history;
}

// ── Otwórz szczegóły ćwiczenia ──
function openExerciseDetail(exId) {
  var exDef = getAllExercises().find(function(e){ return e.id===exId; });
  if (!exDef) return;

  var sheet = document.getElementById('exercise-detail-sheet');
  if (!sheet) return;

  var history = getExerciseHistory(exId);
  var info = EX_DESCRIPTIONS[exId] || {};
  var levelBadge = LEVEL_BADGES[exDef.level] || { emoji:'🟡', label:'Średnie' };

  // Header
  document.getElementById('exd-name').textContent = exDef.name;

  // Content
  var html = '';

  // ── Level + muscle ──
  html += '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px;">';
  html += '<span style="background:var(--surface2);border-radius:20px;padding:5px 12px;font-size:13px;font-weight:600;">'+levelBadge.emoji+' '+levelBadge.label+'</span>';
  html += '<span style="background:var(--surface2);border-radius:20px;padding:5px 12px;font-size:13px;font-weight:600;">💪 '+exDef.muscle+'</span>';
  if (exDef.category) html += '<span style="background:var(--surface2);border-radius:20px;padding:5px 12px;font-size:13px;font-weight:600;">🔧 '+exDef.category+'</span>';
  html += '</div>';

  // ── Muscles map ──
  if (exDef.muscles && Object.keys(exDef.muscles).length) {
    html += '<div class="card" style="margin-bottom:12px;padding:14px 16px;">';
    html += '<div style="font-size:13px;font-weight:700;margin-bottom:10px;">🦵 Zaangażowanie mięśni</div>';
    // Sort by involvement
    var muscleEntries = Object.entries(exDef.muscles).sort(function(a,b){ return b[1]-a[1]; });
    muscleEntries.forEach(function(entry) {
      var key = entry[0], val = entry[1];
      var label = MUSCLE_LABELS[key] || key;
      html += '<div style="margin-bottom:8px;">';
      html += '<div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:3px;">';
      html += '<span style="color:var(--text2);">'+label+'</span>';
      html += '<span style="color:var(--accent);font-weight:700;">'+val+'%</span>';
      html += '</div>';
      html += '<div style="background:var(--surface2);border-radius:4px;height:6px;overflow:hidden;">';
      html += '<div style="width:'+val+'%;height:100%;background:linear-gradient(90deg,var(--accent),var(--accent2));border-radius:4px;transition:width .5s ease;"></div>';
      html += '</div></div>';
    });
    html += '</div>';
  }

  // ── Description ──
  if (info.desc) {
    html += '<div class="card" style="margin-bottom:12px;padding:14px 16px;">';
    html += '<div style="font-size:13px;font-weight:700;margin-bottom:8px;">📋 Jak wykonać</div>';
    html += '<div style="font-size:13px;color:var(--text2);line-height:1.6;">'+info.desc+'</div>';
    if (info.tips && info.tips.length) {
      html += '<div style="font-size:13px;font-weight:700;margin:12px 0 6px;">✅ Wskazówki</div>';
      info.tips.forEach(function(t){ html += '<div style="font-size:13px;color:var(--text2);padding:2px 0;">• '+t+'</div>'; });
    }
    if (info.mistakes && info.mistakes.length) {
      html += '<div style="font-size:13px;font-weight:700;margin:12px 0 6px;">⚠️ Częste błędy</div>';
      info.mistakes.forEach(function(m){ html += '<div style="font-size:13px;color:var(--text3);padding:2px 0;">• '+m+'</div>'; });
    }
    html += '</div>';
  }

  // ── Personal Records ──
  html += '<div class="card" style="margin-bottom:12px;padding:14px 16px;">';
  html += '<div style="font-size:13px;font-weight:700;margin-bottom:10px;">🏆 Twoje rekordy</div>';
  if (!history.length) {
    html += '<div style="font-size:13px;color:var(--text4);">Brak historii wykonania.</div>';
  } else {
    var bestW = Math.max.apply(null, history.map(function(h){ return h.maxWeight; }));
    var bestR = Math.max.apply(null, history.map(function(h){ return h.maxReps; }));
    var bestE1RM = Math.max.apply(null, history.map(function(h){ return h.e1rm; }));
    var totalSets = history.reduce(function(a,h){ return a+h.sets; }, 0);
    var last = history[0];
    var recs = [
      { icon:'⚖️', label:'Największy ciężar', val: bestW+'kg' },
      { icon:'🔁', label:'Najwięcej powtórzeń', val: bestR+' powt.' },
      { icon:'🏋️', label:'Szacowany 1RM', val: Math.round(bestE1RM)+'kg' },
      { icon:'📊', label:'Łączna liczba serii', val: totalSets+' serii' },
      { icon:'📅', label:'Ostatnio', val: new Date(last.date).toLocaleDateString('pl')+' · '+last.maxWeight+'kg×'+last.maxReps },
    ];
    html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">';
    recs.forEach(function(r) {
      html += '<div style="background:var(--surface2);border-radius:12px;padding:10px 12px;">';
      html += '<div style="font-size:11px;color:var(--text3);margin-bottom:2px;">'+r.icon+' '+r.label+'</div>';
      html += '<div style="font-size:14px;font-weight:700;">'+r.val+'</div>';
      html += '</div>';
    });
    html += '</div>';

    // Last 5 sessions
    html += '<div style="font-size:13px;font-weight:700;margin:12px 0 6px;">📈 Ostatnie sesje</div>';
    history.slice(0,5).forEach(function(h) {
      html += '<div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:.5px solid var(--border2);font-size:13px;">';
      html += '<span style="color:var(--text3);">'+new Date(h.date).toLocaleDateString('pl')+'</span>';
      html += '<span style="font-weight:600;">'+h.maxWeight+'kg × '+h.maxReps+' · '+h.sets+' serii</span>';
      html += '</div>';
    });
  }
  html += '</div>';

  // ── Future slots ──
  html += '<div class="card" style="margin-bottom:12px;padding:14px 16px;border:1px dashed var(--border2);opacity:.6;">';
  html += '<div style="font-size:13px;font-weight:700;color:var(--text3);margin-bottom:4px;">🔮 Wkrótce</div>';
  html += '<div style="font-size:12px;color:var(--text4);">GIF instruktażowy · Film · Wskazówki AI · Analiza słabych punktów</div>';
  html += '</div>';

  // ── YouTube ──
  var ytQuery = encodeURIComponent(exDef.name.replace(/\s*\([^)]+\)/g, '').trim());
  html += '<a href="https://www.youtube.com/results?search_query='+ytQuery+'" target="_blank" style="display:flex;align-items:center;justify-content:center;gap:8px;background:#FF0000;color:#fff;border-radius:12px;padding:14px;font-size:14px;font-weight:700;text-decoration:none;margin-bottom:16px;">🎥 Jak wykonać ćwiczenie</a>';

  document.getElementById('exd-content').innerHTML = html;
  sheet.classList.add('open');
}

function closeExerciseDetail() {
  var sheet = document.getElementById('exercise-detail-sheet');
  if (sheet) sheet.classList.remove('open');
}

// ── Analiza planu ──
var MUSCLE_GROUPS_MAP = {
  chest:         'Klatka piersiowa',
  lats:          'Najszerszy grzbiet',
  upperBack:     'Górne plecy',
  lowerBack:     'Dolne plecy',
  traps:         'Czworoboczny',
  frontShoulder: 'Barki przednie',
  midShoulder:   'Barki boczne',
  rearShoulder:  'Barki tylne',
  biceps:        'Biceps',
  triceps:       'Triceps',
  forearms:      'Przedramiona',
  abs:           'Brzuch / Core',
  quads:         'Czworogłowe uda',
  hamstrings:    'Dwugłowe uda',
  glutes:        'Pośladki',
  calves:        'Łydki',
};

function analyzePlan(plan) {
  var muscleVolume = {};
  var totalSets = 0;
  var totalExercises = 0;
  var exIds = [];

  (plan.exercises||[]).forEach(function(ex) {
    var sets = parseInt(ex.sets)||3;
    totalSets += sets;
    totalExercises++;
    exIds.push(ex.id);

    var exDef = getAllExercises().find(function(e){ return e.id===ex.id; });
    if (!exDef || !exDef.muscles) return;

    Object.entries(exDef.muscles).forEach(function(entry) {
      var key=entry[0], pct=entry[1];
      // Weight contribution by involvement percentage
      var contribution = sets * (pct/100);
      muscleVolume[key] = (muscleVolume[key]||0) + contribution;
    });
  });

  // Sort muscles by volume
  var sorted = Object.entries(muscleVolume)
    .sort(function(a,b){ return b[1]-a[1]; })
    .map(function(entry) {
      return {
        key: entry[0],
        label: MUSCLE_GROUPS_MAP[entry[0]] || entry[0],
        volume: entry[1],
        pct: Math.round(entry[1]/totalSets*100),
      };
    });

  // Detect issues
  var warnings = [];
  var allMuscles = Object.keys(MUSCLE_GROUPS_MAP);
  var missing = allMuscles.filter(function(m){ return !muscleVolume[m] || muscleVolume[m] < 0.5; });

  // Check balance
  var quads = muscleVolume['quads']||0;
  var hams  = muscleVolume['hamstrings']||0;
  var chest = muscleVolume['chest']||0;
  var back  = (muscleVolume['lats']||0) + (muscleVolume['upperBack']||0);
  if (quads > hams*2) warnings.push('⚠️ Czworogłowe mają znacznie większą objętość niż dwugłowe uda.');
  if (chest > back*1.5) warnings.push('⚠️ Klatka dominuje nad plecami — ryzyko dysbalansu.');
  if ((muscleVolume['rearShoulder']||0) < 1) warnings.push('⚠️ Tylny akton barków ma bardzo małą objętość.');

  missing.forEach(function(m) {
    var label = MUSCLE_GROUPS_MAP[m];
    if (['calves','forearms','traps'].indexOf(m) === -1) {
      warnings.push('⚠️ Brak ćwiczeń angażujących: '+label+'.');
    }
  });

  if (!warnings.length) warnings.push('✅ Plan jest dobrze zbilansowany.');

  return {
    totalExercises: totalExercises,
    totalSets: totalSets,
    muscles: sorted,
    warnings: warnings,
  };
}

function showPlanAnalysis(planId) {
  var plan = state.plans.find(function(p){ return p.id===planId; });
  if (!plan) return;

  var analysis = analyzePlan(plan);
  var sheet = document.getElementById('plan-analysis-sheet');
  if (!sheet) return;

  document.getElementById('pa-title').textContent = plan.name;

  var html = '';

  // Summary
  html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:16px;">';
  html += '<div style="background:var(--surface2);border-radius:12px;padding:12px;text-align:center;">';
  html += '<div style="font-size:24px;font-weight:800;color:var(--accent);">'+analysis.totalExercises+'</div>';
  html += '<div style="font-size:12px;color:var(--text3);">ćwiczeń</div></div>';
  html += '<div style="background:var(--surface2);border-radius:12px;padding:12px;text-align:center;">';
  html += '<div style="font-size:24px;font-weight:800;color:var(--accent);">'+analysis.totalSets+'</div>';
  html += '<div style="font-size:12px;color:var(--text3);">serii łącznie</div></div>';
  html += '</div>';

  // Warnings
  html += '<div class="card" style="margin-bottom:12px;padding:14px 16px;">';
  html += '<div style="font-size:13px;font-weight:700;margin-bottom:8px;">🔍 Analiza bilansu</div>';
  analysis.warnings.forEach(function(w) {
    var isOk = w.startsWith('✅');
    html += '<div style="font-size:13px;padding:4px 0;color:'+(isOk?'var(--green)':'var(--yellow)')+';">'+w+'</div>';
  });
  html += '</div>';

  // Muscle volume
  html += '<div class="card" style="padding:14px 16px;">';
  html += '<div style="font-size:13px;font-weight:700;margin-bottom:12px;">💪 Objętość na partie</div>';
  if (!analysis.muscles.length) {
    html += '<div style="font-size:13px;color:var(--text4);">Brak danych — przypisz ćwiczenia do planu.</div>';
  } else {
    var maxVol = analysis.muscles[0].volume;
    analysis.muscles.forEach(function(m) {
      var barPct = Math.round(m.volume/maxVol*100);
      html += '<div style="margin-bottom:10px;">';
      html += '<div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:3px;">';
      html += '<span style="color:var(--text2);font-weight:600;">'+m.label+'</span>';
      html += '<span style="color:var(--text3);">~'+m.volume.toFixed(1)+' serii · '+m.pct+'%</span>';
      html += '</div>';
      html += '<div style="background:var(--surface2);border-radius:4px;height:8px;overflow:hidden;">';
      html += '<div style="width:'+barPct+'%;height:100%;background:linear-gradient(90deg,var(--accent),var(--accent2));border-radius:4px;transition:width .5s ease;"></div>';
      html += '</div></div>';
    });
  }
  html += '</div>';

  document.getElementById('pa-content').innerHTML = html;
  sheet.classList.add('open');
}

// ── Remove exercise from active workout ──
function removeExFromWorkout(ei) {
  if (!confirm('Usunąć to ćwiczenie z bieżącego treningu?')) return;
  workoutState.exercises.splice(ei, 1);
  // Recalculate totals
  workoutState.totalSets = workoutState.exercises.reduce(function(a,ex){ return a+(ex.sets||[]).filter(function(s){return s.done;}).length; }, 0);
  workoutState.totalTonnage = workoutState.exercises.reduce(function(a,ex){ return a+(ex.sets||[]).filter(function(s){return s.done;}).reduce(function(b,s){return b+(parseFloat(s.weight)||0)*(parseInt(s.reps)||0);},0); }, 0);
  renderTrainingView();
  showNotif('🗑','Ćwiczenie usunięte','');
}
