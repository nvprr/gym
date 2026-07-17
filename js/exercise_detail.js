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

  // ── NOGI dodatkowe ──
  'e11d':{ desc:'Usiądź na platformie i umieść stopy na odpowiedniej wysokości. Wypchnij platformę nogami do pełnego wyprostu bez blokowania kolan, powoli opuść. Bezpieczna alternatywa dla przysiadu przy dużych ciężarach.', tips:['Nie blokuj kolan na górze','Stopy wyżej = pośladki i ścięgna, niżej = czworogłowe','Pełny zakres ruchu'], mistakes:['Blokowanie kolan','Odrywanie pleców od oparcia','Zbyt wąskie ustawienie stóp'] },
  'e11e':{ desc:'Hack squat na maszynie ze skośnym torem ruchu angażuje głównie czworogłowe. Bardziej pionowy tułów niż przy przysiądzie.', tips:['Stopy na środku platformy','Kolana ku palcom','Pełny zakres ruchu'], mistakes:['Stopy zbyt wysoko','Kolana do środka','Blokowanie kolan na górze'] },
  'k22': { desc:'Belt squat to przysiad z ciężarem zawieszonym na specjalnym pasku biodrowym. Eliminuje obciążenie kręgosłupa — idealne przy problemach z plecami.', tips:['Ciężar wisi swobodnie','Kręgosłup bez obciążenia','Pełny zakres jak przy normalnym przysiądzie'], mistakes:['Brak odpowiedniego sprzętu','Zaokrąglone plecy','Za duże obciążenie na starcie'] },
  'k23': { desc:'Reverse hyperextension angażuje pośladki i dolne plecy. Leż przodem na maszynie i unoś nogi kontrolowanie. Odwrotność normalnej hiperekstenśji.', tips:['Kontrolowany ruch nóg','Nie przeginaj zbyt wysoko','Napięte pośladki na górze'], mistakes:['Zbyt szybkie tempo','Przeginanie lędźwi','Za duże obciążenie'] },
  'k26': { desc:'Przywodzenie bioder na maszynie angażuje przyśrodkowe mięśnie uda. Usiądź i przyciągaj nogi ku sobie wbrew oporowi maszyny.', tips:['Reguluj siedzisko','Pełny zakres ruchu','Powolna ekscentryka'], mistakes:['Zła regulacja siedziska','Zbyt szybki ruch','Za duże obciążenie'] },
  'k27': { desc:'Prasa nóg jednonóż izoluje każdą nogę osobno pomagając wyrównać dysbalanse. Jedna stopa na platformie, druga opuszczona.', tips:['Stopa pośrodku platformy','Pełny zakres ruchu','Kolano nie blokuj na górze'], mistakes:['Zbyt duże obciążenie','Kolano do środka','Blokowanie kolana'] },
  'n7':  { desc:'Burpees łączą przysiad, wyjście do pompki, pompkę i wyskok. Kompleksowe ćwiczenie cardio angażujące całe ciało.', tips:['Pełna pompka w każdym powtórzeniu','Wyskocz jak najwyżej','Utrzymaj rytm'], mistakes:['Omijanie pompki','Brak wyskoku','Lądowanie na sztywnych nogach'] },
  'n8':  { desc:'Thruster z hantlami łączy przysiad z wyciskaniem nad głowę. Eksplozja z przysiadu napędza ciężar w górę. Kompleksowe i wymagające.', tips:['Hantle na barkach na starcie','Płynna eksplozja z przysiadu','Core napięty przez cały czas'], mistakes:['Rozdzielanie ruchu na dwa oddzielne','Zbyt ciężkie hantle','Zaokrąglone plecy'] },
  'n9':  { desc:'Turkish Get Up to kompleksowe ćwiczenie stabilizacji barku. Wstawaj z pozycji leżącej trzymając kettlebell nad głową przez cały czas.', tips:['Wzrok na kettlebell przez cały ruch','Zacznij bez ciężaru','Powolne kontrolowane ruchy'], mistakes:['Zbyt duże kettlebell na starcie','Odwrócenie wzroku','Zbyt szybkie tempo'] },
  'o1':  { desc:'Bieganie angażuje mięśnie nóg, serce i układ oddechowy. Zacznij od wolnego tempa i stopniowo zwiększaj dystans i intensywność.', tips:['Dobra technika biegu — nie uderzaj piętą','Stopniowe zwiększanie dystansu','Odpowiednie obuwie biegowe'], mistakes:['Zbyt szybki start — kontuzja','Uderzanie piętą','Brak rozgrzewki'] },
  'o2':  { desc:'Jazda na rowerze to cardio angażujące głównie mięśnie ud. Ustaw właściwą wysokość siodełka — kolano lekko ugięte przy wyproście pedału.', tips:['Właściwa wysokość siodełka','Miarowe tempo','Angażuj pośladki przy pedałowaniu'], mistakes:['Zbyt nisko siodełko — ból kolan','Brak płynności pedałowania','Zbyt długie serie bez nawodnienia'] },
  'o3':  { desc:'Spinning na rowerze stacjonarnym to intensywne cardio. Może być interwałowe lub w stałym tempie. Reguluj opór do własnych możliwości.', tips:['Reguluj opór stopniowo','Prawidłowa pozycja na rowerze','Oddychaj miarowo'], mistakes:['Za duży opór na starcie','Zła pozycja ciała','Brak nawodnienia'] },
  'o4':  { desc:'Wioślarz angażuje ok. 86% mięśni ciała. Fazy: odpychanie nogami, odchylenie tułowia, przyciągnięcie rąk do żeber. Kolejność ważna.', tips:['Najpierw nogi, potem tułów, potem ręce','Utrzymuj wyprostowane plecy','Pełny zakres ruchu'], mistakes:['Zaokrąglone plecy','Ciąganie tylko ramionami','Zbyt szybkie tempo kosztem techniki'] },
  'o5':  { desc:'Orbitrek angażuje zarówno nogi jak i ramiona przy minimalnym obciążeniu stawów. Doskonały dla osób z kontuzjami kolan lub bioder.', tips:['Pełny zakres ruchu','Utrzymuj wyprostowane plecy','Aktywnie angażuj ręce'], mistakes:['Opieranie się na rączkach','Brak zaangażowania rąk','Zbyt wolne tempo'] },
  'o6':  { desc:'Stepper symuluje wchodzenie po schodach i intensywnie angażuje pośladki i uda. Nie opieraj się za mocno na rączkach.', tips:['Postaw całą stopę na podnóżku','Utrzymaj wyprostowane plecy','Nie opieraj się za mocno'], mistakes:['Opieranie się na rączkach','Zbyt szybkie tempo','Brak zaangażowania pośladków'] },
  'o7':  { desc:'Pływanie angażuje całe ciało bez obciążania stawów. Różne style (kraul, grzbietowy, delfin) angażują różne partie mięśniowe.', tips:['Oddychaj rytmicznie','Wydłużaj glide między uderzeniami','Różnicuj style dla pełnego treningu'], mistakes:['Zbyt szybkie tempo na początku','Unoszenie głowy zbyt wysoko','Brak techniki — zapisz się na lekcje'] },
  'o8':  { desc:'Rucking to marsz z ciężkim plecakiem. Wzmacnia nogi, core i wydolność. Militarne ćwiczenie wytrzymałościowe.', tips:['Zacznij od 10-15% masy ciała','Dobra postawa','Stopniowo zwiększaj ciężar i dystans'], mistakes:['Za duże obciążenie na starcie','Zła postawa — garbienie się','Zbyt szybki marsz na starcie'] },
  'o9':  { desc:'Skakanka to doskonałe cardio angażujące łydki i koordynację. Skacz na palcach utrzymując równy rytm.', tips:['Skacz na palcach','Nadgarstki kręcą linkę — nie ramiona','Zacznij od 30-60 sekund'], mistakes:['Lądowanie na całej stopie','Zbyt wysokie skakanie','Brak rytmu'] },
  'o10': { desc:'Sprinty to krótkie maksymalne biegi aktywujące szybkie włókna mięśniowe. 10-30 metrów lub 5-10 sekund z pełną intensywnością.', tips:['Dokładna rozgrzewka przed sprintami','Maksymalna intensywność','Pełny odpoczynek między powtórzeniami'], mistakes:['Brak rozgrzewki — kontuzja','Zbyt długie serie','Za mało odpoczynku'] },

  // ── KLATKA p-seria ──
  'p1':  { desc:'Wyciskanie z pinami — sztanga startuje z pinów na określonej wysokości eliminując dolną fazę. Trenuje słaby punkt i buduje siłę eksplozywną.', tips:['Ustaw piny na właściwej wysokości','Pełne napięcie przed ruchem','Eksplozywny ruch w górę'], mistakes:['Zła wysokość pinów','Brak napięcia na starcie','Zbyt duże obciążenie'] },
  'p3':  { desc:'Pullover ze sztangą z ugiętymi ramionami angażuje klatkę i najszerszy grzbiet. Ugięcie łokci zmniejsza naprężenie na stawach.', tips:['Łokcie ugięte przez cały ruch','Leż prostopadle do ławki','Kontroluj ruch'], mistakes:['Prostowanie łokci','Zbyt duży zakres ruchu','Utrata kontroli'] },
  'p4':  { desc:'Wyciskanie klatki na wyciągu zapewnia stałe napięcie przez cały zakres. Stań przy wyciągu i wypychaj uchwyty przed siebie.', tips:['Stałe napięcie przez cały ruch','Ściągaj łopatki przed ruchem','Pełny wyprost ramion'], mistakes:['Brak stabilizacji tułowia','Zbyt szybki ruch','Rotacja tułowia'] },
  'p5':  { desc:'Wyciskanie hantli wąskim chwytem angażuje bardziej triceps i wewnętrzną klatkę. Trzymaj hantle pionowo blisko siebie.', tips:['Hantle pionowo i blisko siebie','Łokcie blisko tułowia','Pełny zakres ruchu'], mistakes:['Rozjazd hantli','Zbyt szybki ruch','Brak zaangażowania tricepsa'] },
  'p6':  { desc:'Pompki z nogami wyżej niż ręce zwiększają zaangażowanie górnej klatki i barków. Nogi na ławce lub skrzynce.', tips:['Im wyżej nogi tym więcej górna klatka','Core napięty przez cały czas','Pełny zakres ruchu'], mistakes:['Opadanie bioder','Zbyt szybkie tempo','Nogi za wysoko — ból barków'] },
  'p7':  { desc:'Pompki w piramidce (pike push-ups) z biodrami wysoko angażują głównie barki. Ruch ku podłodze skupia pracę na barkach.', tips:['Biodra wysoko w górze','Ruch głowy ku podłodze','Core napięty'], mistakes:['Za małe ugięcie','Opadające biodra','Zbyt szybkie tempo'] },
  'p8':  { desc:'Pompki z deficytu z dłońmi na podwyższeniu (kettlebell, dyski) dają głębsze rozciągnięcie klatki niż normalne pompki.', tips:['Stabilne podwyższenie','Pełny zakres — klatka poniżej dłoni','Core napięty'], mistakes:['Niestabilne podpórki','Zbyt szybkie tempo','Opadanie bioder'] },
  'p9':  { desc:'Wyciskanie hantli na ławce daje większy zakres ruchu niż ze sztangą i lepszą izolację każdej strony klatki.', tips:['Hantle w linii klatki na dole','Ruch łukowy łącząc ku górze','Łokcie 45-75° od tułowia'], mistakes:['Hantle za szeroko na dole','Zbyt szybki ruch','Brak synchronizacji rąk'] },
  'p10': { desc:'Rozpiętki leżąc przodem na ławce skośnej angażują górną klatkę i tylne barki pod unikalnym kątem.', tips:['Kąt ławki 30°','Ugięte łokcie','Skup na tylnych barkach i górnej klatce'], mistakes:['Zbyt duże obciążenie','Brak kontroli ruchu','Wzruszanie barkami'] },
  'p11': { desc:'Pompki z dłońmi na podwyższeniu angażują dolną klatkę. Im wyższe podwyższenie tym więcej dolna klatka.', tips:['Im wyżej dłonie tym więcej dolna klatka','Pełny zakres ruchu','Core napięty przez cały czas'], mistakes:['Opadanie bioder','Zbyt szybkie tempo','Zła wysokość podwyższenia'] },
  'p12': { desc:'Wyciskanie izolateralne pozwala pracować każdą stroną osobno wyrównując dysbalanse. Maszyna lub dwa oddzielne ruchy.', tips:['Równe obciążenie obu stron','Pełny zakres ruchu','Skup się na słabszej stronie'], mistakes:['Kompensacja mocniejszą stroną','Rotacja tułowia','Zbyt duże obciążenie'] },
  'p13': { desc:'Maszyna izolateralna do klatki trenuje każdą stronę osobno. Idealna do wyrównywania dysbalansów.', tips:['Reguluj siedzisko','Każda ręka osobno','Pełne zaciśnięcie klatki'], mistakes:['Zła regulacja siedziska','Zbyt szybki ruch','Wzruszanie barkami'] },
  'p14': { desc:'Izolateralna maszyna skośna w dół trenuje dolną klatkę każdą stroną osobno.', tips:['Reguluj siedzisko','Skupiaj na dolnej klatce','Powolna ekscentryka'], mistakes:['Zła regulacja','Kompensacja tułowiem','Zbyt duże obciążenie'] },
  'p15': { desc:'Izolateralna maszyna skośna w górę trenuje górną klatkę i barki każdą stroną osobno.', tips:['Reguluj siedzisko wysoko','Pełny zakres ruchu','Skupiaj na górnej klatce'], mistakes:['Zła regulacja','Wzruszanie barkami','Zbyt szybki ruch'] },
  'p16': { desc:'Wyciskanie z pauzą eliminuje odbijanie od klatki i uczy prawidłowego napięcia. Pauza 1-3 sekundy przy klatce.', tips:['Napięcie mięśni podczas pauzy','Nie relaksuj się w pauzie','Stopniowo wydłużaj czas pauzy'], mistakes:['Relaksowanie mięśni w pauzie','Odbijanie po pauzie','Zbyt długa pauza'] },
  'p17': { desc:'Wyciskanie skośne z pauzą buduje siłę górnej klatki i eliminuje moment pędu. Pauza 1-2 sekundy.', tips:['Pauza przy klatce','Napięcie przez pauzę','Eksplozywny ruch w górę'], mistakes:['Luźne mięśnie w pauzie','Odbijanie od klatki','Zbyt duże obciążenie'] },
  'p18': { desc:'Rozpiętki leżąc przodem na ławce skośnej angażują górną klatkę pod unikalnym kątem. Leż przodem, rozciągaj hantle na boki.', tips:['Kąt ławki 30-45°','Ugięte łokcie','Ruch łukowy na boki'], mistakes:['Zbyt duże obciążenie','Prostowanie łokci','Brak kontroli'] },
  'p19': { desc:'Wyciskanie szerokim chwytem na maszynie angażuje zewnętrzne włókna klatki z kontrolowanym torem.', tips:['Reguluj siedzisko','Pełny zakres ruchu','Powolna ekscentryka'], mistakes:['Zła regulacja','Wzruszanie barkami','Zbyt szybki ruch'] },
  'p20': { desc:'Wyciskanie Larsen z hantlami bez oparcia nóg zwiększa zaangażowanie stabilizatorów klatki. Nogi uniesione lub wyciągnięte.', tips:['Nogi uniesione przez cały czas','Stabilny core','Hantle kontrolowane'], mistakes:['Utrata stabilizacji','Zbyt duże obciążenie','Opuszczanie nóg'] },
  'p21': { desc:'Wyciskanie ze sztangą na podłodze bez ławki. Podłoga ogranicza zakres do ok. 90° chroniąc stawy. Dobra opcja do treningu solo.', tips:['Łokcie dotykają podłogi na dole','Stopy płasko','Eksplozywny ruch w górę'], mistakes:['Odbijanie łokci od podłogi','Zbyt szybki ruch','Brak asekuranta przy dużych ciężarach'] },
  'p22': { desc:'Wyciskanie hantli z pinami trenuje eksplozywność z pozycji statycznej. Hantle startują z pinów.', tips:['Piny na właściwej wysokości','Napięcie przed ruchem','Eksplozywny ruch'], mistakes:['Zła wysokość pinów','Brak napięcia na starcie','Zbyt duże ciężary'] },
  'p23': { desc:'Rozpiętki na maszynie z stałym napięciem przez cały zakres. Usiądź, chwyć uchwyty i zbliżaj je przed siebie.', tips:['Reguluj siedzisko','Ściśnij klatkę w centrum','Powolna ekscentryka'], mistakes:['Zła regulacja','Zbyt szybki ruch','Wzruszanie barkami'] },
  'p24': { desc:'Pec deck to maszyna z podparciem ramion do ćwiczenia klatki. Przedramiona na opornikach i zbliżaj je przed siebie.', tips:['Łokcie na poziomie barków','Ściśnij klatkę mocno na końcu','Kontroluj powrót'], mistakes:['Łokcie za wysoko','Gwałtowny powrót','Wzruszanie barkami'] },
  'p25': { desc:'Wyciskanie skośne w suwnicy Smitha z bezpiecznym torem ruchu i kątem ławki 30-45°.', tips:['Ławka 30-45°','Opuszczaj do górnej klatki','Kontrolowany ruch'], mistakes:['Zły kąt ławki','Za mały zakres ruchu','Zbyt duże obciążenie'] },
  'p26': { desc:'Pompki łucznicze trenują każdą stronę klatki osobno. Naprzemiennie przenoś ciężar na jedną rękę podczas opuszczania.', tips:['Naprzemiennie obie strony','Pełny zakres ruchu','Stabilny core'], mistakes:['Brak pełnego zakresu po obu stronach','Opadanie bioder','Nierówna praca stron'] },
  'p27': { desc:'Pompki z klaśnięciem rozwijają moc eksplozywną. Wypchnij mocno, unieś dłonie i klasnij, wyląduj miękko.', tips:['Wypchnij maksymalnie mocno','Miękkie lądowanie','Progresja od normalnych pompek'], mistakes:['Niewystarczająca siła wypchnięcia','Twarde lądowanie','Zbyt wczesna próba'] },
  'p28': { desc:'Pompki kobra na kolanach to wariacja z łukiem klatki. Kolana na macie, opuszczasz klatkę ku podłodze z łukiem.', tips:['Kolana na macie','Łuk w odcinku piersiowym','Kontrolowany ruch'], mistakes:['Ból kolan bez maty','Za duży łuk — ból pleców','Brak kontroli'] },
  'p29': { desc:'Wyciskanie TRX z taśmami angażuje klatkę i stabilizatory. Im bardziej pochylone ciało tym trudniejsze.', tips:['Reguluj długość taśm','Im niżej głowa tym trudniej','Stabilny core'], mistakes:['Brak stabilizacji core','Asymetria rąk','Zbyt wolne tempo'] },

  // ── PLECY p-seria ──
  'p2':  { desc:'Wiosłowanie leżąc przodem na ławce eliminuje kiwanie tułowia i izoluje plecy. Leż na ławce i wiosłuj hantlami lub sztangą do klatki.', tips:['Klatka stabilnie na ławce','Ściągaj łopatki','Pełny zakres ruchu'], mistakes:['Odrywanie klatki od ławki','Wzruszanie barkami','Za mały zakres'] },
  'p30': { desc:'Wiosłowanie ze sztangą w przodopochyleniu skupia się na środkowych partiach pleców. Pochyl tułów i przyciągaj sztangę do brzucha.', tips:['Tułów stabilny w skłonie','Ściągaj łopatki','Pełny zakres ruchu'], mistakes:['Zaokrąglone plecy','Kiwanie tułowia','Zbyt szybki ruch'] },
  'p31': { desc:'Martwy ciąg ze sztangą za plecami angażuje czworoboczny i górne plecy z innego kąta niż standardowy deadlift.', tips:['Bar za plecami blisko nóg','Kręgosłup neutralny','Chwyt wygodny'], mistakes:['Zaokrąglone plecy','Bar za daleko od nóg','Niekomfortowy chwyt'] },
  'p32': { desc:'Wiosłowanie w skłonie na wyciągu zapewnia stałe napięcie przez cały zakres. Pochyl tułów i ściągaj linkę do brzucha.', tips:['Tułów stabilny','Ściągaj do brzucha','Kontroluj powrót'], mistakes:['Kiwanie tułowia','Zbyt szybki ruch','Wzruszanie barkami'] },
  'p33': { desc:'Wiosłowanie T-bar z podparciem klatki eliminuje kompensację tułowia. Klatka na podparciu, ściągaj do klatki.', tips:['Klatka stabilnie oparta','Ściągaj łopatki','Pełny zakres ruchu'], mistakes:['Zła pozycja klatki','Wzruszanie barkami','Zbyt szybki ruch'] },
  'p34': { desc:'Chin-up (podchwytem) angażuje bardziej biceps niż nachwytem. Chwyt podchwytem na szerokość barków, podciągnij do brody.', tips:['Chwyt na szerokość barków','Łokcie blisko tułowia','Pełny zakres ruchu'], mistakes:['Kiwanie się','Zbyt szybkie opuszczanie','Brak pełnego wyprostu'] },
  'p35': { desc:'Podciąganie wąskim chwytem angażuje wewnętrzne włókna najszerszego. Chwyt węższy niż szerokość barków.', tips:['Łokcie blisko tułowia','Ściągaj łopatki','Pełny zakres ruchu'], mistakes:['Kiwanie się','Zbyt wąski chwyt — ból nadgarstków','Brak pełnego zakresu'] },
  'p36': { desc:'Wiszenie na drążku dekompresuje kręgosłup i wzmacnia chwyt. Aktywnie angażuj barki — nie wisiej pasywnie.', tips:['Aktywne barki — nie pasywne wiszenie','Stopniowo wydłużaj czas','Oddychaj spokojnie'], mistakes:['Pasywne wiszenie — ból barków','Zbyt długo na starcie','Brak aktywacji barków'] },
  'p37': { desc:'Wiosłowanie dwoma kettlebell angażuje plecy i wymaga dobrej stabilizacji. Pochyl się i wiosłuj obiema kettlebell jednocześnie.', tips:['Tułów stabilny w skłonie','Ściągaj łopatki','Kettlebell blisko ciała'], mistakes:['Zaokrąglone plecy','Kiwanie tułowia','Zbyt duże kettlebell'] },
  'p38': { desc:'Wiosłowanie z hantlami leżąc na ławce eliminuje kiwanie tułowia i izoluje mięśnie pleców.', tips:['Klatka stabilna na ławce','Ściągaj do bioder','Pełny zakres ruchu'], mistakes:['Odrywanie klatki od ławki','Wzruszanie barkami','Za mały zakres'] },
  'p39': { desc:'Podciąganie wysoko (głowa ponad drążek) wymaga dużej siły i mobilności barków. Zaawansowane ćwiczenie.', tips:['Progresja od normalnych podciągnięć','Mocne zaangażowanie łopatek','Bezpieczne opuszczanie'], mistakes:['Zbyt wczesna próba','Brak wystarczającej siły','Niebezpieczne opuszczanie'] },
  'p40': { desc:'Izolateralne wiosłowanie wysoko angażuje górne plecy i tylne barki każdą stroną osobno.', tips:['Reguluj siedzisko','Pełny zakres ruchu','Ściągaj łopatkę'], mistakes:['Zła regulacja','Kompensacja tułowiem','Wzruszanie barkami'] },
  'p41': { desc:'Izolateralne wiosłowanie nisko angażuje dolny najszerszy każdą stroną osobno.', tips:['Reguluj siedzisko','Ściągaj do biodra','Pełny zakres ruchu'], mistakes:['Zła regulacja','Odginanie tułowia','Zbyt szybki ruch'] },
  'p42': { desc:'Izolateralne wiosłowanie trenuje każdą stronę pleców osobno wyrównując dysbalanse.', tips:['Każda ręka osobno','Pełny zakres ruchu','Ściągaj łopatkę'], mistakes:['Kompensacja silniejszą stroną','Rotacja tułowia','Zbyt duże obciążenie'] },
  'p43': { desc:'Wiosłowanie na maszynie z podparciem zapewnia bezpieczny tor ruchu. Idealne dla rehabilitacji lub finiszowania treningu.', tips:['Reguluj siedzisko','Pełny zakres ruchu','Powolna ekscentryka'], mistakes:['Zła regulacja','Wzruszanie barkami','Zbyt szybki ruch'] },
  'p44': { desc:'Wiosłowanie jedną ręką na wyciągu dolnym zapewnia stałe napięcie. Stabilizuj tułów wolną ręką.', tips:['Tułów stabilny','Ściągaj do biodra','Pełny zakres ruchu'], mistakes:['Rotacja tułowia','Wzruszanie barkami','Za mały zakres'] },
  'p45': { desc:'Martwy ciąg semi-sumo to wariant pośredni między klasycznym a sumo. Nieco szerszy rozkrok niż klasyczny.', tips:['Rozkrok pośredni','Kręgosłup neutralny','Bar blisko ciała'], mistakes:['Zaokrąglone plecy','Kolana do środka','Bar za daleko'] },
  'p46': { desc:'Wiosłowanie w skłonie w suwnicy Smitha z kontrolowanym torem ruchu. Bezpieczniejsza wersja dla osób z bólem pleców.', tips:['Tułów stabilny w skłonie','Ściągaj do brzucha','Pełny zakres ruchu'], mistakes:['Kiwanie tułowia','Wzruszanie barkami','Zbyt duże obciążenie'] },
  'p47': { desc:'Wiosłowanie odwróconym chwytem w Smithie angażuje bardziej biceps i dolne włókna najszerszego.', tips:['Podchwyt dłonie ku górze','Ściągaj do pępka','Kontrolowany powrót'], mistakes:['Kiwanie tułowia','Za mały zakres','Zbyt szybki ruch'] },
  'p48': { desc:'Wiosłowanie T-bar leżąc przodem na ławce eliminuje kompensację tułowia i izoluje plecy.', tips:['Klatka stabilna na ławce','Ściągaj łopatki razem','Pełny zakres ruchu'], mistakes:['Unoszenie klatki od ławki','Wzruszanie barkami','Zbyt szybki ruch'] },
  'p49': { desc:'Wiosłowanie w front leverze to zaawansowane ćwiczenie gimnastyczne na plecy i core. Wymaga lat treningu kalistenicz.', tips:['Dopiero po opanowaniu progressions','Całe ciało napięte','Powolny kontrolowany ruch'], mistakes:['Zbyt wczesna próba','Opadające biodra','Brak stabilizacji core'] },
  'p50': { desc:'Maszyna trakcja pionowa to odpowiednik podciągania z asystą. Lepsza niż brak podciągania dla osób uczących się.', tips:['Reguluj obciążenie','Naśladuj ruch podciągania','Pełny zakres ruchu'], mistakes:['Zbyt duże wsparcie — utrudnia progresję','Wzruszanie barkami','Brak pełnego zakresu'] },
  'p51': { desc:'Podciąganie szerokim chwytem angażuje zewnętrzne włókna najszerszego. Chwyt szerszy niż barki.', tips:['Chwyt szerszy od barków','Ściągaj do klatki','Inicjuj od łopatek'], mistakes:['Za szeroki chwyt — ból barków','Kiwanie się','Brak pełnego zakresu'] },
  'p52': { desc:'Szrugi na wyciągu dolnym z stałym napięciem przez cały zakres. Stój przy wyciągu i wzruszaj barkami.', tips:['Wzruszaj ku górze i do tyłu','Stałe napięcie przez cały ruch','Pełne opuszczenie'], mistakes:['Kręcenie barkami','Zbyt szybkie tempo','Za mały zakres'] },
  'p53': { desc:'Szrugi z hex barem to wygodniejsza opcja z neutralnym chwytem i lepszą stabilnością niż sztanga.', tips:['Stań w centrum hex bara','Neutralny chwyt','Wzruszaj prosto w górę'], mistakes:['Kręcenie barkami','Zbyt duże obciążenie','Brak pełnego zakresu'] },
  'p54': { desc:'Szrugi na maszynie to bezpieczna opcja z kontrolowanym torem ruchu. Idealne do izolacji czworobocznego.', tips:['Reguluj wysokość','Wzruszaj ku górze','Pełne opuszczenie po każdym powt.'], mistakes:['Zła regulacja','Kręcenie barkami','Zbyt szybki ruch'] },
  'p55': { desc:'Szrugi dynamiczne ze sztangą łączą wzruszanie z lekkim odpychaniem bioder budując eksplozywny czworoboczny.', tips:['Eksplozywny ruch bioder','Wzruszaj barkami na górze','Bar blisko ciała'], mistakes:['Brak użycia bioder','Kręcenie barkami','Zbyt duże obciążenie'] },
  'p56': { desc:'Superman to ćwiczenie na dolne plecy bez sprzętu. Leż przodem i unoś jednocześnie ręce i nogi.', tips:['Wolny kontrolowany ruch','Trzymaj w górze 2 sekundy','Oddychaj normalnie'], mistakes:['Zbyt szybkie tempo','Ból szyi — nie zadzieraj głowy','Zbyt długo trzymasz na górze'] },
  'p57': { desc:'Wiosłowanie odwrócone przy stole z własną masą ciała. Chwyć blat stołu i podciągaj klatkę.', tips:['Im poziomiej ciało tym trudniej','Ściągaj łopatki','Pełny zakres ruchu'], mistakes:['Opadające biodra','Wzruszanie barkami','Niestabilny stół'] },
  'p58': { desc:'Wiosłowanie odwrócone jedną ręką angażuje każdą stronę pleców osobno z własną masą ciała.', tips:['Stabilna pozycja pod drążkiem','Ściągaj łopatkę','Pełny zakres ruchu'], mistakes:['Rotacja tułowia','Wzruszanie barkami','Brak pełnego zakresu'] },
  'p59': { desc:'Szrugi w suwnicy Smitha to bezpieczna wersja szrugów z kontrolowanym torem ruchu.', tips:['Ustawienie szerokości chwytu','Wzruszaj ku górze','Pełne opuszczenie'], mistakes:['Kręcenie barkami','Zbyt duże obciążenie','Zła pozycja stóp'] },
  'p60': { desc:'Back lever to ćwiczenie gimnastyczne na drążku. Ciało poziome twarzą w dół pod drążkiem trzymane siłą ramion i pleców.', tips:['Progresja przez wiele etapów','Całe ciało napięte','Bezpieczne ćwicz z kocem pod spodem'], mistakes:['Za wczesna próba bez progressions','Luźne mięśnie','Brak odpowiednich progressions'] },
  'p61': { desc:'Front lever to ćwiczenie gimnastyczne. Ciało poziome twarzą w górę trzymane siłą pleców i core.', tips:['Długa progresja wymagana','Zacznij od tuck (nogi zgięte)','Napięcie całego ciała'], mistakes:['Za wczesna próba pełnej wersji','Luźny core','Brak progressions'] },
  'p62': { desc:'Ściąganie drążka klęcząc jedną ręką izoluje najszerszy z lepszym zaangażowaniem stabilizatorów.', tips:['Klęcząc jedno kolano do przodu','Ściągaj do biodra','Pełny zakres ruchu'], mistakes:['Rotacja tułowia','Wzruszanie barkami','Za mały zakres'] },
  'p63': { desc:'Ściąganie krzyżowe angażuje najszerszy pod innym kątem. Ściągaj z góry ukośnie ku środkowi tułowia.', tips:['Uchwyt ukośny przez tułów','Ściągaj do brzucha','Powolny kontrolowany ruch'], mistakes:['Wzruszanie barkami','Zbyt szybki ruch','Zły tor ruchu'] },
  'p64': { desc:'Ściąganie drążka jedną ręką z wyciągu górnego izoluje każdą stronę najszerszego.', tips:['Stabilizuj tułów wolną ręką','Ściągaj do boku klatki','Pełny zakres ruchu'], mistakes:['Rotacja tułowia','Wzruszanie barkami','Brak pełnego zakresu'] },
  'p65': { desc:'Ściąganie jedną ręką to odmiana pulldown angażująca każdą stronę osobno.', tips:['Stabilny tułów','Ściągaj łopatkę','Powolna ekscentryka'], mistakes:['Kiwanie tułowia','Wzruszanie barkami','Za szybki powrót'] },
  'p66': { desc:'Wiosłowanie z hantlem jednostronnie wymaga dobrej stabilizacji core. Tułów stabilny, ściągaj łopatkę.', tips:['Tułów stabilny','Ściągaj łopatkę na górze','Pełny zakres ruchu'], mistakes:['Rotacja tułowia','Wzruszanie barkami','Za mały zakres'] },
  'p67': { desc:'Podciąg rwania to ćwiczenie pomocnicze do rwania olimpijskiego. Eksplozywne unoszenie sztangi do brody.', tips:['Bar blisko ciała','Eksplozja bioder w górnej fazie','Stań na palcach na górze'], mistakes:['Bar za daleko od ciała','Brak eksplozji bioder','Zbyt wolny ruch'] },
  'p68': { desc:'Podciąganie łucznicze angażuje każdą stronę osobno. Podciągaj się do jednej ręki, druga wyprostowana.', tips:['Progresja od asysty taśmy','Mocny chwyt','Pełny zakres ruchu'], mistakes:['Za wczesna próba','Brak asysty na starcie','Nierówna praca stron'] },
  'p69': { desc:'Podciąganie z asystą maszyny pozwala ćwiczyć podciąganie osobom niepotrafiącym jeszcze samodzielnie.', tips:['Stopniowo zmniejszaj asystę','Technika jak normalne podciąganie','Pełny zakres ruchu'], mistakes:['Zbyt duże wsparcie','Wzruszanie barkami','Brak progresji'] },
  'p70': { desc:'Chin-up z asystą to podciąganie podchwytem ze wsparciem maszyny lub taśmy. Naucz się techniki.', tips:['Stopniowo mniej wsparcia','Łokcie blisko tułowia','Pełny zakres ruchu'], mistakes:['Zbyt duże wsparcie','Kiwanie się','Brak progresji'] },
  'p71': { desc:'Podciąganie z taśmą oporową redukuje efektywny ciężar. Taśma założona na drążek i nogi lub kolano.', tips:['Taśma na stopę lub kolano','Stopniowo lżejsza taśma','Pełny zakres ruchu'], mistakes:['Zbyt mocna taśma','Kiwanie się','Brak pełnego wyprostu na dole'] },
  'p72': { desc:'Podciąganie z klaśnięciem to ćwiczenie eksplozywne. Podciągnij się mocno, puść drążek, klasnij i szybko chwyć.', tips:['Bezpieczna mata pod spodem','Progresja od eksplozywnych podciągnięć','Mocny chwyt na powrót'], mistakes:['Za wczesna próba','Brak asekuracji','Niewystarczająca siła bazowa'] },
  'p73': { desc:'Muscle-up to przejście z podciągania przez drążek na dips nad drążkiem jednym ruchem. Wymaga siły i techniki.', tips:['Opanuj podciąganie i dipy osobno','Fałszywy chwyt (false grip) pomaga','Progresja przez etapy'], mistakes:['Za wczesna próba bez podstawy siłowej','Brak techniki przejścia','Zbyt mała siła'] },
  'p74': { desc:'Podciąganie jedną ręką to szczyt kalistenics górnej części ciała. Wymaga wielu miesięcy lub lat progressions.', tips:['Lata progressions wymagane','Zacznij od archer pull-ups','Nigdy nie pomijaj etapów'], mistakes:['Za wczesna próba','Niewystarczająca baza','Kontuzje z pośpiechu'] },
  'p75': { desc:'Podciąganie TRX z taśmami jako wiosłowanie. Im bardziej poziome ciało tym trudniejsze.', tips:['Reguluj długość taśm','Im niżej tym trudniej','Ściągaj łopatki'], mistakes:['Opadające biodra','Wzruszanie barkami','Zbyt szybkie tempo'] },
  'p76': { desc:'Szrugi z hantlami dają większy zakres ruchu i lepsze rozciągnięcie czworobocznego niż ze sztangą.', tips:['Wzruszaj ku górze i do tyłu','Nie kręć barkami','Pełne opuszczenie'], mistakes:['Kręcenie barkami','Zbyt duże hantle','Za mały zakres'] },

  // ── BARKI p-seria ──
  'p77': { desc:'Wznosy sztangi przodem angażują przednie barki. Stój i unoś sztangę przed siebie do poziomu barków.', tips:['Chwyt na szerokość barków','Nie unoś wyżej niż barki','Kontroluj powrót'], mistakes:['Wzruszanie barkami','Zbyt duże obciążenie','Użycie rozmachu ciałem'] },
  'p78': { desc:'Rotacja zewnętrzna na wyciągu wzmacnia rotatory zewnętrzne barku — mięśnie często pomijane i podatne na kontuzje.', tips:['Łokieć przy tułowiu','Mały zakres z dużą kontrolą','Rotuj dłoń na zewnątrz'], mistakes:['Ruszanie łokcia','Zbyt duże obciążenie','Za szybki ruch'] },
  'p79': { desc:'Rotacja wewnętrzna na wyciągu wzmacnia rotatory wewnętrzne. Łokieć przy tułowiu, rotuj w kierunku brzucha.', tips:['Łokieć przy tułowiu','Kontrolowany ruch','Małe obciążenie'], mistakes:['Ruszanie łokcia','Zbyt szybkie tempo','Za duże obciążenie'] },
  'p80': { desc:'Rotacja zewnętrzna z hantlem leżąc na boku wzmacnia rotatory zewnętrzne. Łokieć zgięty 90° rotuj ku górze.', tips:['Łokieć zgięty 90°','Leż stabilnie na boku','Mały zakres z pełną kontrolą'], mistakes:['Zbyt duże hantle','Ruszanie łokciem','Za szybkie tempo'] },
  'p81': { desc:'Facepull z hantlami naśladuje ruch facepull. Pochyl się i przyciągaj hantle do twarzy z łokciami na boki.', tips:['Łokcie na poziomie barków','Zewnętrzna rotacja','Kontroluj powrót'], mistakes:['Łokcie za nisko','Brak rotacji zewnętrznej','Wzruszanie tułowia'] },
  'p82': { desc:'Wysokie unoszenie hantli to eksplozywny ruch angażujący barki i czworoboczny. Przyciągaj do brody z łokciami wysoko.', tips:['Eksplozywny ruch','Łokcie wyżej niż barki','Bar blisko ciała'], mistakes:['Brak eksplozji','Łokcie za nisko','Zbyt duże obciążenie'] },
  'p83': { desc:'Wznosy Y na skosie angażują dolny czworoboczny i tylne barki. Leż przodem na skosie i unoś w kształt Y.', tips:['Kąt ławki 30°','Kciuki do góry','Powolny kontrolowany ruch'], mistakes:['Zbyt duże hantle','Wzruszanie barkami','Zbyt szybkie tempo'] },
  'p84': { desc:'Wznosy hantli to ogólna nazwa dla unoszenia hantli ramionami. Zależy od kierunku — boczne, przednie lub tylne.', tips:['Zdefiniuj kierunek ruchu','Lekkie ugięcie łokci','Kontroluj powrót'], mistakes:['Wzruszanie barkami','Zbyt szybkie tempo','Zbyt duże obciążenie'] },
  'p85': { desc:'Odwrotne rozpiętki z hantlami angażują tylne barki. Pochyl się i unoś hantle na boki z lekko ugiętymi łokciami.', tips:['Tułów pochylony do 45°','Lekkie ugięcie łokci','Kontroluj powrót'], mistakes:['Wzruszanie barkami','Za mały pochyl','Zbyt szybki ruch'] },
  'p86': { desc:'Wiosłowanie tylny bark z hantlami to wiosłowanie w pochyleniu skupione na tylnym aktonie barku.', tips:['Łokcie na zewnątrz od tułowia','Ściągaj do poziomu barków','Pełny zakres ruchu'], mistakes:['Łokcie przy tułowiu — angażujesz więcej plecy','Wzruszanie barkami','Za mały zakres'] },
  'p87': { desc:'Wznosy odwrotne z hantlami angażują tylne barki i środkowe plecy. Pochyl tułów i unoś na boki.', tips:['Tułów pochylony','Lekkie ugięcie łokci','Powolna ekscentryka'], mistakes:['Za mały pochyl','Zbyt szybkie tempo','Wzruszanie barkami'] },
  'p88': { desc:'Wiosłowanie do brody z hantlami angażuje barki i czworoboczny. Przyciągaj hantle do brody z łokciami wysoko.', tips:['Chwyt szeroki','Łokcie powyżej barków','Powolny powrót'], mistakes:['Zbyt wąski chwyt','Zbyt szybkie tempo','Wzruszanie barkami'] },
  'p89': { desc:'Wiosłowanie do brody z EZ-barem redukuje naprężenie na nadgarstki. Łokcie wyżej niż barki.', tips:['Naturalne ugięcie nadgarstków z EZ','Łokcie wyżej niż barki','Kontroluj powrót'], mistakes:['Zbyt wąski chwyt','Wzruszanie barkami','Zbyt szybki ruch'] },
  'p90': { desc:'Wyciskanie w staniu na rękach to zaawansowane ćwiczenie kalisteniczne na barki wymagające świetnej stabilności.', tips:['Opanuj handstand najpierw','Nogi przy ścianie na początku','Napięte całe ciało'], mistakes:['Za wczesna próba bez ściany','Luźne mięśnie','Brak progresji'] },
  'p91': { desc:'Wyciskanie izolateralne barków trenuje każdą stronę osobno z maszyną wyrównując dysbalanse.', tips:['Reguluj siedzisko','Każda ręka osobno','Pełny zakres ruchu'], mistakes:['Zła regulacja','Kompensacja silniejszą stroną','Zbyt duże obciążenie'] },
  'p92': { desc:'Odwrotne rozpiętki na maszynie izolują tylne barki z kontrolowanym torem ruchu.', tips:['Reguluj siedzisko','Łokcie na poziomie barków','Powolna ekscentryka'], mistakes:['Zła regulacja','Wzruszanie barkami','Zbyt szybki ruch'] },
  'p93': { desc:'Wyciskanie militarne ze sztangą to strict press bez użycia nóg. Czysta siła barków i tricepsa.', tips:['Ścisła technika bez użycia nóg','Core napięty przez cały czas','Pełny wyprost ramion'], mistakes:['Odginanie do tyłu','Użycie nóg','Zbyt duże obciążenie'] },
  'p94': { desc:'Wznosy przodem jedną ręką na wyciągu izolują każdy przedni bark osobno.', tips:['Stabilizuj tułów wolną ręką','Nie unoś wyżej niż barki','Powolny powrót'], mistakes:['Rotacja tułowia','Wzruszanie barkami','Zbyt szybki ruch'] },
  'p95': { desc:'Odwrotne rozpiętki jedną ręką na wyciągu izolują tylny bark z stałym napięciem.', tips:['Stabilizuj tułów','Łokieć lekko ugięty','Powolna ekscentryka'], mistakes:['Rotacja tułowia','Wzruszanie barkami','Zbyt szybki ruch'] },
  'p96': { desc:'Boczne unoszenie jedną ręką z hantlem pozwala skoncentrować się na każdej stronie osobno.', tips:['Stabilizuj tułów wolną ręką','Nie unoś wyżej niż barki','Powolny powrót'], mistakes:['Rotacja tułowia','Wzruszanie barkami','Zbyt szybki ruch'] },
  'p97': { desc:'Pompki w piramidce (pike) angażują głównie barki. Biodra wysoko, ruch głowy ku podłodze.', tips:['Biodra wysoko','Ruch głowy ku podłodze','Core napięty'], mistakes:['Za małe ugięcie','Opadające biodra','Zbyt szybkie tempo'] },
  'p98': { desc:'Boczne unoszenie siedząc eliminuje użycie rozmachu ciałem i izoluje boczną głowę barku.', tips:['Siedź stabilnie','Lekkie ugięcie łokci','Kontroluj powrót'], mistakes:['Użycie rozmachu ciałem','Wzruszanie barkami','Zbyt szybkie tempo'] },
  'p99': { desc:'Wyciskanie militarne siedząc z prostym oparciem uniemożliwia użycie nóg i odginanie pleców.', tips:['Pionowe oparcie','Pełny zakres ruchu','Napięty core'], mistakes:['Odginanie do tyłu','Łokcie za barkami','Zbyt duże obciążenie'] },
  'p100':{ desc:'Wyciskanie barków siedząc — ze sztangą lub hantlami. Siedząca pozycja stabilizuje tułów.', tips:['Siedzisko stabilne','Pełny zakres ruchu','Core napięty'], mistakes:['Odginanie do tyłu','Zbyt szybkie tempo','Za duże obciążenie'] },
  'p101':{ desc:'Wyciskanie barków to fundamentalne ćwiczenie na barki. Stojąc lub siedząc, ze sztangą lub hantlami.', tips:['Stałe napięcie core','Pełny wyprost nad głową','Kontroluj powrót'], mistakes:['Odginanie do tyłu','Zbyt duże obciążenie','Brak pełnego zakresu'] },
  'p102':{ desc:'Wyciskanie w suwnicy Smitha siedząc z bezpiecznym torem. Dobra opcja dla treningu solo.', tips:['Reguluj siedzisko','Tor maszyny','Pełny zakres ruchu'], mistakes:['Zła regulacja siedziska','Odginanie do tyłu','Za duże obciążenie'] },
  'p103':{ desc:'Boczne unoszenie na maszynie stojąc izoluje boczną głowę barku z stałym napięciem.', tips:['Reguluj ramię maszyny','Lekkie ugięcie łokci','Powolna ekscentryka'], mistakes:['Zła regulacja','Wzruszanie barkami','Zbyt szybki ruch'] },
  'p104':{ desc:'Wznosy Y na TRX angażują dolny czworoboczny i tylne barki. Unoś ramiona w kształt Y z kciukami do góry.', tips:['Kciuki do góry','Powolny ruch','Ściągaj łopatki'], mistakes:['Za szybkie tempo','Brak zaangażowania łopatek','Opadające biodra'] },
  'p105':{ desc:'Wyciskanie TRX na barki z taśmami. Im bardziej pochylone ciało tym trudniejsze.', tips:['Reguluj długość taśm','Im niżej głowa tym trudniej','Core napięty'], mistakes:['Brak stabilizacji','Zbyt szybkie tempo','Asymetria rąk'] },
  'p106':{ desc:'Rozpiętki T na TRX angażują tylne barki i środkowe plecy. Rozciągaj ramiona w kształt T z kciukami do góry.', tips:['Kciuki do góry','Ściągaj łopatki','Powolna ekscentryka'], mistakes:['Za szybkie tempo','Opadające biodra','Brak zaangażowania łopatek'] },
  'p107':{ desc:'Z-press to wyciskanie barków siedząc na podłodze bez oparcia. Wymaga dobrej mobilności bioder i prostych pleców.', tips:['Siedź na podłodze z prostymi plecami','Mobilność bioder wymagana','Core napięty'], mistakes:['Zaokrąglone plecy','Zbyt duże obciążenie','Brak mobilności'] },
  'p108':{ desc:'Z-press ze sztangą to zaawansowany wariant wyciskania siedzącego na podłodze.', tips:['Pełny wyprost pleców','Mobilność bioder','Progresja od hantli do sztangi'], mistakes:['Zaokrąglone plecy','Zbyt duże obciążenie','Brak mobilności'] },
  'p109':{ desc:'Wznosy przodem leżąc na skosie eliminują użycie rozmachu i izolują przednie barki.', tips:['Kąt ławki 30°','Lekkie ugięcie łokci','Powolny ruch'], mistakes:['Wzruszanie barkami','Zbyt duże hantle','Zbyt szybki ruch'] },
  'p110':{ desc:'Wyciskanie barków z hantlami to podstawowe ćwiczenie — siedząc lub stojąc z hantlami.', tips:['Łokcie przed linią tułowia','Pełny zakres ruchu','Core napięty'], mistakes:['Łokcie za barkami','Odginanie do tyłu','Zbyt duże hantle'] },
  'p111':{ desc:'Wiosłowanie przodem kettlebell to unikalny ruch angażujący barki przednie i boczne jednocześnie.', tips:['Kettlebell blisko ciała','Łokcie wyżej niż barki','Powolny powrót'], mistakes:['Wzruszanie barkami','Zbyt duże kettlebell','Zbyt szybki ruch'] },
  'p112':{ desc:'Planche to zaawansowane ćwiczenie gimnastyczne. Ciało poziome z oparciem wyłącznie na dłoniach. Wymaga lat treningu.', tips:['Lata progressions wymagane','Zacznij od tuck planche','Całe ciało superdpięte'], mistakes:['Za wczesna próba pełnej wersji','Luźne mięśnie','Brak progressions'] },
  'p113':{ desc:'Pompki planche to pompki w pozycji planche. Ekstremalnie zaawansowane na barki i core.', tips:['Opanuj planche najpierw','Długa progresja','Siła całego ciała wymagana'], mistakes:['Za wczesna próba','Brak podstawowej siły','Kontuzje z pośpiechu'] },
  'p114':{ desc:'Szarpnięcie siłowe (power jerk) to wariant wyciskania olimpijskiego z szerokim ustawieniem nóg.', tips:['Eksplozja bioder','Szybkie podsiady pod sztangę','Stabilne lądowanie'], mistakes:['Brak eksplozji','Niestabilne lądowanie','Zbyt duże obciążenie'] },
  'p115':{ desc:'Wyciskanie z odpychiem (push jerk) łączy podsiad z eksplozywnym wyciskaniem barków.', tips:['Podsiad i eksplozja jednocześnie','Szerokie lądowanie','Stabilne barki nad głową'], mistakes:['Brak synchronizacji','Niestabilne lądowanie','Zbyt duże obciążenie'] },
  'p116':{ desc:'Szarpnięcie nożycowe (split jerk) to klasyczny wariant olimpijskiego wyciskania z krokiem nożycowym.', tips:['Eksplozja bioder','Krok nożycowy do przodu i w tył','Stabilne lądowanie'], mistakes:['Brak kroku','Niestabilne lądowanie','Zbyt wąski rozkrok'] },
  'p117':{ desc:'Pompki w piramidce na kolanach to łatwiejsza wersja pike push-ups. Kolana na podłodze, biodra wysoko.', tips:['Kolana na macie','Biodra wysoko','Głowa ku podłodze'], mistakes:['Za małe ugięcie','Opadające biodra','Zbyt szybkie tempo'] },
  'p233':{ desc:'Liny bojowe angażują ramiona, barki i core intensywnym falowaniem. Doskonałe cardio z treningiem siłowym.', tips:['Stabilna pozycja z ugiętymi kolanami','Utrzymuj rytm falowania','Angażuj core'], mistakes:['Zbyt długie serie na starcie','Brak napięcia core','Opadające barki'] },
  'p246':{ desc:'Wyciskanie dwóch kettlebell angażuje barki z neutralnym chwytem. Wyciskaj oba jednocześnie.', tips:['Neutralny chwyt','Pełny zakres ruchu','Core napięty'], mistakes:['Odginanie do tyłu','Zbyt duże kettlebell','Brak pełnego wyprostu'] },
  'p247':{ desc:'Szarpnięcie nożycowe z kettlebell angażuje barki i nogi z eksplozywnym ruchem.', tips:['Eksplozja bioder','Krok nożycowy','Stabilne lądowanie'], mistakes:['Brak eksplozji','Niestabilne lądowanie','Zbyt duże kettlebell'] },
  'p250':{ desc:'Rwanie mięśniowe z hantlami to ciągnięcie hantli nad głowę jednym eksplozywnym ruchem.', tips:['Eksplozja bioder','Hantel blisko ciała','Stabilne lądowanie'], mistakes:['Brak eksplozji','Hantel za daleko','Niestabilne lądowanie'] },
  'p252':{ desc:'Push press z hantlami łączy lekki podsiad z eksplozywnym wyciskaniem hantlami.', tips:['Lekki podsiad przed wyciskaniem','Eksplozja nóg','Stabilne lądowanie'], mistakes:['Zbyt głęboki podsiad','Brak eksplozji','Niestabilne ramiona'] },
  'p263':{ desc:'Rwanie mięśniowe (muscle snatch) ze sztangą do pozycji nad głową bez pełnego kucania pod sztangę.', tips:['Technika olimpijska','Zawsze z trenerem','Progresja od podstaw'], mistakes:['Brak techniki','Zbyt duże obciążenie','Brak rozgrzewki'] },

  // ── BICEPS p-seria ──
  'p118':{ desc:'Uginanie skupione ze sztangą z łokciami opartymi o uda eliminuje użycie tułowia i izoluje biceps.', tips:['Łokcie oparte o uda','Pełny zakres ruchu','Ściskaj biceps na górze'], mistakes:['Kiwanie tułowia','Brak oparcia łokci','Zbyt duże obciążenie'] },
  'p119':{ desc:'Uginanie młotkowe na wyciągu z neutralnym chwytem i stałym napięciem.', tips:['Neutralny chwyt','Stałe napięcie kabla','Powolna ekscentryka'], mistakes:['Kiwanie tułowia','Zbyt szybki ruch','Za mały zakres'] },
  'p120':{ desc:'Uginanie z zamachem (cheat curl) pozwala na większe obciążenie. Kontrolowany rozmach — powolna faza opuszczania.', tips:['Kontrolowany rozmach — nie za duży','Powolna ekscentryka','Zaawansowana technika'], mistakes:['Za duży niekontrolowany rozmach','Szybka ekscentryka','Zbyt wczesne stosowanie'] },
  'p121':{ desc:'Uginanie skupione z hantlem z łokciem opartym o udo. Pełna izolacja bicepsa.', tips:['Łokieć stabilnie oparty','Pełny zakres ruchu','Ściskaj biceps na górze'], mistakes:['Ruszający się łokieć','Kiwanie tułowia','Za duży hantel'] },
  'p122':{ desc:'Uginanie odwrócone z hantlami z chwytem pronowanym angażuje brachialis i prostowniki przedramienia.', tips:['Chwyt pronowany — dłonie w dół','Łokcie przy tułowiu','Powolna ekscentryka'], mistakes:['Ból nadgarstków','Kiwanie tułowia','Za duże hantle'] },
  'p123':{ desc:'Spider curl z hantlami leżąc przodem na ławce dla pełnej izolacji bicepsa.', tips:['Klatka stabilna na ławce','Pełny zakres ruchu','Powolna ekscentryka'], mistakes:['Odrywanie klatki od ławki','Zbyt szybki ruch','Za duże hantle'] },
  'p124':{ desc:'Uginanie na wyciągu leżąc daje unikalne rozciągnięcie bicepsa przy pełnym wyproście.', tips:['Leż pod wyciągiem','Pełny wyprost na dole','Powolna ekscentryka'], mistakes:['Za mały zakres ruchu','Zbyt szybki ruch','Za duże obciążenie'] },
  'p125':{ desc:'Uginanie na modlitewniku jedną ręką z hantlem izoluje każdą stronę osobno.', tips:['Ramię oparte stabilnie na podkładce','Pełny zakres ruchu','Ściskaj biceps na górze'], mistakes:['Ruszający się łokieć','Zbyt szybki ruch','Za duży hantel'] },
  'p126':{ desc:'Uginanie kettlebell jedną ręką z neutralnym chwytem angażuje biceps i brachialis.', tips:['Neutralny chwyt','Łokieć przy tułowiu','Pełny zakres ruchu'], mistakes:['Kiwanie tułowia','Za duże kettlebell','Zbyt szybki ruch'] },
  'p127':{ desc:'Uginanie odwrócone ze sztangą angażuje brachialis i prostowniki przedramienia.', tips:['Chwyt pronowany','Łokcie przy tułowiu','Powolna ekscentryka'], mistakes:['Ból nadgarstków — użyj EZ-bara','Kiwanie tułowia','Za duże obciążenie'] },
  'p128':{ desc:'Uginanie nadgarstka odwrócone wzmacnia prostowniki nadgarstka — strona grzbietowa przedramienia.', tips:['Łokieć stabilny na ławce','Mały kontrolowany ruch','Powolna ekscentryka'], mistakes:['Zbyt duże obciążenie','Za szybki ruch','Ruszający się łokieć'] },
  'p129':{ desc:'Uginanie nadgarstka odwrócone na wyciągu z stałym napięciem.', tips:['Stałe napięcie kabla','Małe ruchy nadgarstka','Łokieć stabilny'], mistakes:['Za szybki ruch','Zbyt duże obciążenie','Ruszający się łokieć'] },
  'p130':{ desc:'Uginanie nadgarstka na wyciągu wzmacnia zginacze przedramienia z stałym napięciem.', tips:['Łokieć stabilny na ławce','Pełny zakres ruchu','Powolna ekscentryka'], mistakes:['Ruszający się łokieć','Za szybkie tempo','Zbyt duże obciążenie'] },
  'p131':{ desc:'Uginanie nadgarstka z hantlem — klasyczne ćwiczenie na zginacze przedramienia. Siedź z łokciem na kolanie.', tips:['Łokieć na kolanie','Pełny zakres ruchu','Powolna ekscentryka'], mistakes:['Ruszający się łokieć','Zbyt duże hantle','Za szybki ruch'] },
  'p132':{ desc:'Uginanie nadgarstka odwrócone z hantlem wzmacnia prostowniki nadgarstka.', tips:['Łokieć stabilny','Mały kontrolowany zakres','Powolna ekscentryka'], mistakes:['Za duże hantle','Zbyt szybki ruch','Ruszający się łokieć'] },
  'p133':{ desc:'Uginanie młotkowe z ręcznikiem wzmacnia chwyt i brachialis. Zwinięty ręcznik zastępuje hantel.', tips:['Chwyć ręcznik pewnie','Neutralny chwyt','Pełny zakres ruchu'], mistakes:['Luźny chwyt ręcznika','Kiwanie tułowia','Za szybki ruch'] },
  'p134':{ desc:'Ściskacz do dłoni wzmacnia siłę chwytu i mięśnie przedramienia. Ściskaj i zwalniaj powoli.', tips:['Pełny ścisk dłoni','Powolne zwalnianie','Progresja do mocniejszych sprężyn'], mistakes:['Zbyt szybkie tempo','Brak pełnego ścisku','Zbyt słaba sprężyna — za łatwe'] },
  'p135':{ desc:'Uginanie nadgarstka jedną ręką na wyciągu dla izolacji każdej strony przedramienia.', tips:['Stałe napięcie kabla','Łokieć stabilny','Pełny zakres ruchu'], mistakes:['Ruszający się łokieć','Zbyt duże obciążenie','Za szybki ruch'] },

  // ── TRICEPS p-seria ──
  'p136':{ desc:'Dipsy z asystą maszyny pozwalają ćwiczyć dipy osobom za słabym tricepsem. Stopniowo zmniejszaj asystę.', tips:['Stopniowo zmniejszaj wsparcie','Tułów pionowy dla tricepsa','Pełny zakres ruchu'], mistakes:['Zbyt duże wsparcie — utrudnia progresję','Brak progresji','Pochylony tułów'] },
  'p137':{ desc:'Prostowanie tricepsa klęcząc z własną masą ciała. Klęcząc opuść się na przedramiona i wróć prostując łokcie.', tips:['Klęcząc na macie','Łokcie pod barkami','Pełny wyprost ramion'], mistakes:['Opadające biodra','Zbyt szybkie tempo','Za małe ugięcie'] },
  'p138':{ desc:'Prostowanie tricepsa nad głową z własną masą ciała angażuje długą głowę. Ćwiczenie kalisteniczne.', tips:['Łokcie przy uszach','Pełne rozciągnięcie na dole','Kontroluj ruch'], mistakes:['Łokcie na zewnątrz','Zbyt szybkie tempo','Za mały zakres'] },
  'p139':{ desc:'Prostowanie tricepsa z masą ciała zależy od kąta ciała. Im bardziej poziome ciało tym trudniej.', tips:['Reguluj trudność kątem ciała','Pełny wyprost ramion','Napięty core'], mistakes:['Opadające biodra','Zbyt szybkie tempo','Za mały zakres'] },
  'p140':{ desc:'Odrzut na wyciągu angażuje triceps przy pełnym wyproście z stałym napięciem kabla.', tips:['Łokieć nieruchomy przy tułowiu','Pełny wyprost na końcu','Powolna ekscentryka'], mistakes:['Ruszający łokieć','Zbyt szybki ruch','Za duże obciążenie'] },
  'p141':{ desc:'Odrzut triceps na wyciągu bocznym z pochylonym tułowiem. Wyprostuj łokieć do tyłu.', tips:['Tułów pochylony','Łokieć przy tułowiu','Pełny wyprost'], mistakes:['Ruszający łokieć','Zbyt szybki ruch','Za mały zakres'] },
  'p142':{ desc:'Dipsy na poręczach to podstawowe kalisteniczne ćwiczenie na triceps i klatkę.', tips:['Tułów pionowy = więcej tricepsa','Pełny zakres ruchu','Kontroluj opuszczanie'], mistakes:['Zbyt głęboko — ból barków','Brak kontroli','Wzruszanie barkami'] },
  'p143':{ desc:'Prostowanie tricepsa nad głową z hantlem — jeden lub dwa hantli nad głową.', tips:['Łokcie przy uszach','Pełne rozciągnięcie','Powolna ekscentryka'], mistakes:['Łokcie na zewnątrz','Odginanie do tyłu','Za duże hantle'] },
  'p144':{ desc:'Odrzut z hantlem w opadzie — pełny wyprost przedramienia za siebie.', tips:['Łokieć przy tułowiu','Pełny wyprost ramienia','Powolna ekscentryka'], mistakes:['Ruszający łokieć','Zbyt szybki ruch','Za duży hantel'] },
  'p145':{ desc:'Prostowanie tricepsa leżąc z hantlem — hantel za głowę i wyprost.', tips:['Łokieć skierowany ku sufitowi','Pełne rozciągnięcie za głową','Powolna ekscentryka'], mistakes:['Łokieć na zewnątrz','Zbyt szybki ruch','Za duży hantel'] },
  'p146':{ desc:'Prostowanie tricepsa na maszynie z stałym torem i napięciem przez cały zakres.', tips:['Reguluj siedzisko','Pełny zakres ruchu','Ściskaj triceps na dole'], mistakes:['Zła regulacja','Zbyt szybki ruch','Wzruszanie barkami'] },
  'p147':{ desc:'Pompki jedną ręką to zaawansowane ćwiczenie na triceps i klatkę z własną masą. Długa progresja.', tips:['Progresja od archera','Stabilna pozycja','Core napięty'], mistakes:['Za wczesna próba','Opadające biodra','Brak stabilizacji'] },
  'p148':{ desc:'Pompki odwróconym chwytem angażują triceps i przednie barki. Dłonie skierowane ku zewnątrz.', tips:['Komfortowy kąt dłoni','Pełny zakres ruchu','Core napięty'], mistakes:['Ból nadgarstków','Opadające biodra','Za szybkie tempo'] },
  'p149':{ desc:'Dipsy rosyjskie to zaawansowana wariacja dipów z ruchem do przodu. Angażuje triceps intensywnie.', tips:['Opanuj normalne dipy najpierw','Powolny kontrolowany ruch','Stabilna pozycja'], mistakes:['Za wczesna próba','Brak kontroli','Zbyt szybkie tempo'] },
  'p150':{ desc:'Dipsy na maszynie siedząc to bezpieczna wersja dipów z kontrolowanym torem ruchu.', tips:['Reguluj siedzisko','Tułów pionowy','Pełny zakres ruchu'], mistakes:['Zła regulacja','Pochylony tułów — angażujesz klatkę','Zbyt szybki ruch'] },
  'p151':{ desc:'Pompki tiger bend to zaawansowane pompki z opuszczeniem na przedramiona angażujące triceps intensywnie.', tips:['Opanuj normalne pompki','Powolny ruch w dół','Kontrolowane opuszczenie'], mistakes:['Za wczesna próba','Brak kontroli','Zbyt szybkie tempo'] },
  'p152':{ desc:'Prostowanie tricepsa — ogólna nazwa dla wyprostu przedramienia. Z kablem, hantlem lub sztangą.', tips:['Łokieć stabilny','Pełny wyprost','Powolna ekscentryka'], mistakes:['Ruszający łokieć','Zbyt szybki ruch','Za duże obciążenie'] },
  'p153':{ desc:'Popychanie tricepsa na wyciągu — pushdown. Klasyczne ćwiczenie izolacyjne z drążkiem.', tips:['Łokcie przy tułowiu','Pełny wyprost na dole','Powolna ekscentryka'], mistakes:['Ruszające łokcie','Wzruszanie barkami','Zbyt szybki ruch'] },
  'p154':{ desc:'Prostowanie leżąc z EZ-barem to skull crusher z naturalnym chwytem chroniącym nadgarstki.', tips:['Naturalne ugięcie EZ-bara','Łokcie skierowane ku sufitowi','Powolna ekscentryka'], mistakes:['Łokcie na zewnątrz','Zbyt szybki ruch','Za duże obciążenie'] },
  'p155':{ desc:'Pompki na pięściach stabilizują nadgarstki i angażują triceps z neutralnym chwytem.', tips:['Pięści na macie','Stabilne nadgarstki','Pełny zakres ruchu'], mistakes:['Brak maty','Opadające biodra','Za szybkie tempo'] },
  'p156':{ desc:'Pompki wąskim chwytem angażują bardziej triceps. Dłonie pod klatką blisko siebie.', tips:['Dłonie pod klatką','Łokcie blisko tułowia','Pełny zakres ruchu'], mistakes:['Zbyt wąski chwyt — ból nadgarstków','Opadające biodra','Za szybkie tempo'] },
  'p157':{ desc:'Pompki rosyjskie to zaawansowana wariacja z ruchem do przodu. Triceps i core.', tips:['Opanuj normalne pompki','Powolny ruch do przodu','Core napięty'], mistakes:['Za wczesna próba','Brak kontroli','Opadające biodra'] },

  // ── BRZUCH p-seria ──
  'p158':{ desc:'Rowerek leżąc (air bike) łączy crunch z rotacją. Naprzemiennie łokieć do kolana z pełnym skrętem tułowia.', tips:['Pełna rotacja tułowia','Nogi równolegle do podłogi','Napięty core'], mistakes:['Ciągnięcie za szyję','Brak rotacji — tylko ramiona','Zbyt szybkie tempo'] },
  'p177':{ desc:'Dotykanie pięty angażuje boczne mięśnie brzucha. Leż z ugiętymi kolanami i naprzemiennie dosięgaj pięt.', tips:['Leż z ugiętymi kolanami','Ruch boczny bez podnoszenia bioder','Pełny dosięg'], mistakes:['Unoszenie bioder','Zbyt szybkie tempo','Za mały zakres'] },
  'p211':{ desc:'Skłon boczny z hantlem angażuje mięśnie boczne tułowia. Pochylaj się z hantlem na bok.', tips:['Ruch tylko na boki','Powolne tempo','Obie strony równo'], mistakes:['Pochylanie do przodu','Zbyt szybkie tempo','Tylko jedna strona'] },
  'p218':{ desc:'Maszyna abcoaster to maszyna do brzucha z kołowym torem ruchu. Klęcząc poruszaj kolanami w łuku.', tips:['Reguluj opór','Pełny zakres ruchu','Napięty core'], mistakes:['Zła regulacja','Za szybki ruch','Brak napięcia core'] },
  'p219':{ desc:'Bird dog (wiosłujący piesek) angażuje stabilizatory kręgosłupa. Na czworakach unoś przeciwne ramię i nogę jednocześnie.', tips:['Neutralny kręgosłup','Powolny kontrolowany ruch','Napięty brzuch'], mistakes:['Rotacja bioder','Za szybki ruch','Brak równowagi'] },
  'p220':{ desc:'Rąbanie drewna na wyciągu angażuje skośne ruchem rotacyjnym. Ściągaj ukośnie od góry do dołu.', tips:['Ruch ukośny','Rotacja tułowia — nie tylko ramion','Stabilne nogi'], mistakes:['Brak rotacji tułowia','Tylko ramiona','Zbyt szybkie tempo'] },
  'p221':{ desc:'Unoszenie kolan na fotelu kapitańskim z podparciem łokci. Unoś ugięte kolana do klatki.', tips:['Stabilne podparcie łokci','Unoś kolana do klatki','Kontroluj opuszczanie'], mistakes:['Kiwanie się','Zbyt szybkie tempo','Brak kontroli przy opuszczaniu'] },
  'p222':{ desc:'Unoszenie nóg na fotelu kapitańskim z wyprostowanymi nogami. Trudniejsze niż z ugiętymi kolanami.', tips:['Proste nogi lub lekko ugięte','Kontroluj opuszczanie','Mocne podparcie'], mistakes:['Zbyt szybkie tempo','Kiwanie się','Brak kontroli'] },
  'p223':{ desc:'Klasyczny crunch — unoś barki od podłogi ściskając brzuch. Krótki ruch skupiony na górnym brzuchu.', tips:['Unoś barki nie całe plecy','Wydychaj przy uniesieniu','Powolna ekscentryka'], mistakes:['Ciągnięcie za szyję','Pełny sit-up','Zbyt szybkie tempo'] },
  'p224':{ desc:'Sit-upy żabie z łokciami dotykającymi kolan na górze. Pełny sit-up z akcentem na rotację.', tips:['Pełny zakres ruchu','Łokcie do kolan na górze','Kontroluj powrót'], mistakes:['Ciągnięcie za szyję','Brak dotyku łokci','Zbyt szybkie tempo'] },
  'p225':{ desc:'Spięcia na wyciągu górnym z liny. Klęcząc ściągaj linkę ku podłodze napinając brzuch.', tips:['Klęcząc lub stojąc','Giń w talii — nie w biodrach','Powolna ekscentryka'], mistakes:['Ciągnięcie ramionami','Zbyt duże obciążenie','Brak ruchu w talii'] },
  'p226':{ desc:'Sit-up odwrócony na ławce skośnej z głową wyżej. Unikalny kąt angażujący brzuch.', tips:['Bezpieczne podparcie nóg','Pełny zakres ruchu','Ręce lekko przy głowie'], mistakes:['Ciągnięcie za szyję','Zbyt szybkie tempo','Brak pełnego zakresu'] },
  'p227':{ desc:'Plank z przechyłem — w pozycji planku przechylaj biodra na boki angażując skośne.', tips:['Małe kontrolowane przechyły','Stabilny tułów','Napięty core'], mistakes:['Za duże przechyły','Opadające biodra','Za szybkie tempo'] },
  'p228':{ desc:'Plank boczny z odwodzeniem nogi angażuje boczne mięśnie brzucha i pośladek. Unoś nogę w planku bocznym.', tips:['Biodra w linii','Kontrolowane odwodzenie','Napięty core'], mistakes:['Opadające biodra','Za duże odwodzenie','Zbyt szybkie tempo'] },
  'p230':{ desc:'Wspinaczka górska na TRX z nogami w pętlach — trudniejsza wersja mountain climbers.', tips:['Nogi w pętlach TRX','Stabilna pozycja planku','Szybkie naprzemienne tempo'], mistakes:['Opadające biodra','Brak stabilizacji','Za wolne tempo'] },
  'p231':{ desc:'Plank TRX z nogami w taśmach — trudniejsza wersja angażująca więcej stabilizatorów.', tips:['Stopy w pętlach TRX','Prosta linia ciała','Oddychaj miarowo'], mistakes:['Opadające biodra','Brak napięcia core','Za krótki czas'] },
  'p260':{ desc:'Russian twist z kettlebell intensywniej angażuje skośne. Siedź z uniesionymi nogami i obracaj kettlebell na boki.', tips:['Stopy uniesione','Pełna rotacja z kettlebell','Kontrolowany ruch'], mistakes:['Brak rotacji — tylko ramiona','Za szybkie tempo','Za ciężkie kettlebell'] },
  'p262':{ desc:'Wiatraki z kettlebell to zaawansowane ćwiczenie na core i mobilność z kettlebell nad głową.', tips:['Wzrok na kettlebell przez cały ruch','Powolny kontrolowany ruch','Mobilność bioder wymagana'], mistakes:['Zbyt ciężkie kettlebell','Brak kontroli','Ból barku'] },

  // ── NOGI p-seria ──
  'p159':{ desc:'Przysiad hack ze sztangą za plecami angażuje czworogłowe z bardziej pionowym tułowiem.', tips:['Sztanga za łydkami','Tułów pionowy','Pełny zakres ruchu'], mistakes:['Zaokrąglone plecy','Kolana do środka','Za mały zakres'] },
  'p160':{ desc:'Wykroki w tył ze sztangą na barkach. Krok do tyłu angażuje czworogłowe i pośladki.', tips:['Krok w tył','Tylne kolano blisko podłogi','Tułów pionowy'], mistakes:['Za mały krok','Kolana do środka','Zaokrąglone plecy'] },
  'p161':{ desc:'Przysiad na skrzyni z masą ciała uczy prawidłowej techniki i głębokości bez obciążenia.', tips:['Kontrolowane opadanie','Pełna głębokość','Eksplozja w górę'], mistakes:['Plumping na skrzynię','Za wysoka skrzynka','Brak kontroli'] },
  'p162':{ desc:'Good morning z masą ciała uczy prawidłowego ruchu biodrowego bez ryzyka kontuzji. Podstawa do wersji z obciążeniem.', tips:['Nogi lekko ugięte','Plecy proste przez cały czas','Biodra do tyłu'], mistakes:['Zaokrąglone plecy','Kolana zablokowane','Zbyt głęboki skłon'] },
  'p163':{ desc:'Przysiad z masą ciała to podstawowe ćwiczenie nauki techniki. Bez obciążenia, skup się na ruchu.', tips:['Kolana ku palcom','Tułów lekko do przodu','Pełna głębokość'], mistakes:['Kolana do środka','Pięty uniesione','Za mały zakres'] },
  'p164':{ desc:'Prostowanie nóg na wyciągu stojąc z opaską na kostce. Izolacja czworogłowych jednostronnie.', tips:['Stabilna pozycja stojąca','Pełny wyprost','Powolna ekscentryka'], mistakes:['Kiwanie tułowia','Za szybki ruch','Za duże obciążenie'] },
  'p165':{ desc:'Wznosy łydek w opadzie (donkey calf raise) z pochylonym tułowiem dają doskonałe rozciągnięcie łydek.', tips:['Tułów poziomy lub pochylony','Pełny zakres ruchu','Powolna ekscentryka'], mistakes:['Za mały zakres','Za szybkie tempo','Brak rozciągnięcia na dole'] },
  'p166':{ desc:'Przysiad bułgarski z hantlami to lżejsza wersja z hantlami wzdłuż boków.', tips:['Hantle wzdłuż boków','Tylna noga na ławce','Pełny zakres ruchu'], mistakes:['Za blisko ławki','Kolano wysuwa się','Za ciężkie hantle'] },
  'p167':{ desc:'Martwy ciąg rumuński z hantlami to wersja z hantlami zamiast sztangi. Większy zakres ruchu.', tips:['Hantle blisko nóg','Lekkie ugięcie kolan','Plecy neutralne'], mistakes:['Hantle za daleko od nóg','Zaokrąglone plecy','Za małe cofnięcie bioder'] },
  'p168':{ desc:'Przysiad nożycowy z hantlami to statyczna pozycja z nogami rozstawionymi szeroko.', tips:['Szerokie nożyce','Tylne kolano blisko podłogi','Tułów pionowy'], mistakes:['Za mały rozkrok','Kolano wysuwa się','Za ciężkie hantle'] },
  'p169':{ desc:'Wznosy łydek na hex barze z piętami na podwyższeniu angażują łydki z innego kąta.', tips:['Pięty na krawędzi','Pełny zakres łydek','Kolana lekko ugięte'], mistakes:['Za mały zakres','Za szybkie tempo','Zbyt proste kolana'] },
  'p170':{ desc:'Przysiad ze skokiem wybuchowym trenuje moc eksplozywną nóg. Z dołu przysiadu wyskakuj maksymalnie.', tips:['Eksplozywny skok','Miękkie lądowanie z ugiętymi kolanami','Zacznij bez obciążenia'], mistakes:['Twarde lądowanie — ryzyko kontuzji','Za duże obciążenie','Brak kontroli'] },
  'p174':{ desc:'Przysiad goblet z ciężarem przy klatce to ćwiczenie techniczne na nogi. Ciężar pomaga utrzymać pionowy tułów.', tips:['Ciężar przy klatce','Kolana na zewnątrz','Pełna głębokość'], mistakes:['Opadające kolana do środka','Zaokrąglone plecy','Za mały zakres'] },
  'p175':{ desc:'Półprzysiad (half squat) to przysiad do ok. 90° w kolanie. Pozwala na większe obciążenie niż pełny.', tips:['Kąt 90° kolan','Plecy proste','Eksplozywny ruch'], mistakes:['Za mały zakres','Kolana do środka','Zaokrąglone plecy'] },
  'p178':{ desc:'Przysiad z podwyższonymi piętami angażuje bardziej czworogłowe. Pięty na klinach lub talerzach.', tips:['Pięty na podwyższeniu','Bardziej pionowy tułów','Pełna głębokość'], mistakes:['Za wysokie podwyższenie','Kolana do środka','Za mały zakres'] },
  'p182':{ desc:'Pozioma prasa nóg angażuje czworogłowe z poziomym torem ruchu.', tips:['Stopy pośrodku platformy','Pełny zakres ruchu','Kolana nie blokuj'], mistakes:['Kolana do środka','Blokowanie kolan','Za duże obciążenie'] },
  'p183':{ desc:'Martwy ciąg jednonóż z kettlebell angażuje pośladki i tylne uda z wyzwaniem balansowym.', tips:['Jedna noga aktywna','Kręgosłup neutralny','Kettlebell blisko nogi'], mistakes:['Utrata równowagi','Zaokrąglone plecy','Za ciężkie kettlebell'] },
  'p184':{ desc:'Przysiad z landmine trzymając jeden koniec sztangi daje naturalny łuk ruchu.', tips:['Naturalny łuk ruchu','Trzymaj bar obiema rękami','Pełny zakres ruchu'], mistakes:['Za małe obciążenie','Zaokrąglone plecy','Zbyt szybkie tempo'] },
  'p185':{ desc:'Uginanie nóg na maszynie leżąc angażuje dwugłowe uda z kontrolowanym torem ruchu.', tips:['Reguluj poduszkę maszyny','Pełny zakres ruchu','Powolna ekscentryka'], mistakes:['Zła regulacja','Unoszenie bioder','Za szybki ruch'] },
  'p186':{ desc:'Prostowanie nóg na maszynie — izolacja czworogłowych.', tips:['Reguluj oparcie','Pełny wyprost','Powolna ekscentryka'], mistakes:['Zła regulacja','Za szybki ruch','Blokowanie kolan'] },
  'p187':{ desc:'Prasa nóg na maszynie to klasyczne ćwiczenie na czworogłowe i pośladki.', tips:['Stopy pośrodku platformy','Pełny zakres ruchu','Kolana nie blokuj'], mistakes:['Kolana do środka','Blokowanie kolan','Za duże obciążenie'] },
  'p188':{ desc:'Przysiad wahadłowy (pendulum squat) to maszyna ze zmiennym kątem ruchu dla czworogłowych.', tips:['Zaznaj się z maszyną','Pełny zakres ruchu','Kolana ku palcom'], mistakes:['Zła regulacja','Za mały zakres','Kolana do środka'] },
  'p189':{ desc:'Przysiad z pinami startujący z pinów trenuje słaby punkt i buduje siłę eksplozywną.', tips:['Piny na właściwej wysokości','Napięcie przed ruchem','Eksplozja w górę'], mistakes:['Zła wysokość pinów','Brak napięcia na starcie','Za duże obciążenie'] },
  'p190':{ desc:'Wykroki w tył angażują czworogłowe z mniejszym obciążeniem na kolana niż wykroki do przodu.', tips:['Krok w tył','Tylne kolano blisko podłogi','Tułów pionowy'], mistakes:['Za mały krok','Kolano wysuwa się','Zbyt szybkie tempo'] },
  'p191':{ desc:'Prostowanie nóg siedząc na maszynie to izolacja czworogłowych.', tips:['Reguluj oparcie siedziska','Pełny wyprost','Powolna ekscentryka'], mistakes:['Zła regulacja','Za szybki ruch','Blokowanie kolan'] },
  'p192':{ desc:'Prasa nóg siedząc to wariant prasy nóg w pozycji siedzącej.', tips:['Pełny zakres ruchu','Stopy pośrodku','Kolana nie blokuj'], mistakes:['Za mały zakres','Kolana do środka','Blokowanie kolan'] },
  'p194':{ desc:'Wykroki w bok angażują przyśrodkową część ud i pośladki. Krok boczny z niskim siadem.', tips:['Szeroki krok na bok','Nisko w dół','Tułów pionowy'], mistakes:['Za mały krok','Za mały siad','Kolana do środka'] },
  'p196':{ desc:'Wyskok na skrzynię jednonóż to bardziej wymagająca wersja box jump na jednej nodze.', tips:['Miękkie lądowanie','Zacznij od niskiej skrzynki','Bezpieczna pozycja'], mistakes:['Twarde lądowanie','Za wysoka skrzynka','Brak kontroli'] },
  'p197':{ desc:'Martwy ciąg rumuński jednonóż izoluje każdą nogę i wymaga dobrego balansu.', tips:['Jedna noga aktywna','Kręgosłup neutralny','Powolny kontrolowany ruch'], mistakes:['Utrata równowagi','Zaokrąglone plecy','Za duże obciążenie'] },
  'p198':{ desc:'Uginanie nóg jednonóż siedząc izoluje każdą nogę osobno.', tips:['Reguluj oparcie','Pełny zakres ruchu','Powolna ekscentryka'], mistakes:['Zła regulacja','Za szybki ruch','Za mały zakres'] },
  'p199':{ desc:'Przysiad na jednej nodze to zaawansowane ćwiczenie wymagające siły i mobilności.', tips:['Zacznij z asystą','Wolna progresja','Mobilność kolan i kostek wymagana'], mistakes:['Za wczesna próba','Brak asysty','Opadające kolano'] },
  'p200':{ desc:'Wznosy łydek na saniach to eksplozywna wersja. Wypychaj sanie siłą łydek.', tips:['Eksplozywny ruch','Pełny wyprost łydki','Kontroluj sanie'], mistakes:['Brak eksplozji','Za małe obciążenie','Brak kontroli'] },
  'p201':{ desc:'Pchanie sań (sled push) to eksplozywne cardio angażujące nogi i biodra.', tips:['Pochyl się do przodu','Eksplozja nóg','Utrzymaj rytm'], mistakes:['Za duże obciążenie','Zbyt mały pochył','Brak rytmu'] },
  'p202':{ desc:'Wznosy łydek w suwnicy Smitha z kontrolowanym torem ruchu.', tips:['Palce na krawędzi podwyższenia','Pełny zakres ruchu','Powolna ekscentryka'], mistakes:['Za mały zakres','Za szybkie tempo','Brak opuszczenia poniżej poziomu'] },
  'p203':{ desc:'Przysiad w suwnicy Smitha z bezpiecznym torem. Dobra opcja dla nauki techniki.', tips:['Stopy nieco do przodu','Pełny zakres ruchu','Bezpieczna alternatywa'], mistakes:['Stopy za blisko maszyny','Za mały zakres','Zbyt duże obciążenie'] },
  'p204':{ desc:'Balans rwania to ćwiczenie techniczne do rwania olimpijskiego. Nauka stabilnej pozycji dolnej.', tips:['Zacznij bez ciężaru','Szeroki chwyt','Stabilne barki nad głową'], mistakes:['Za wczesna próba z ciężarem','Brak mobilności','Niestabilne barki'] },
  'p205':{ desc:'Przysiad to fundamentalne ćwiczenie nóg z masą ciała lub obciążeniem.', tips:['Kolana ku palcom','Pełna głębokość','Core napięty'], mistakes:['Kolana do środka','Za mały zakres','Zaokrąglone plecy'] },
  'p206':{ desc:'Przysiad ze skokiem trenuje moc eksplozywną. Z dołu przysiadu wyskakuj jak najwyżej.', tips:['Eksplozywny skok','Miękkie lądowanie','Bezpiecznie bez obciążenia na starcie'], mistakes:['Twarde lądowanie','Za duże obciążenie','Brak kontroli'] },
  'p207':{ desc:'Unoszenie palców stopy (tibialis raise) wzmacnia mięsień piszczelowy przedni. Ważny dla stabilizacji kolan.', tips:['Pięty na krawędzi','Unoś palce maksymalnie','Powolny ruch'], mistakes:['Za małe unoszenie','Za szybkie tempo','Zbyt rzadko wykonywane'] },
  'p208':{ desc:'Wchodzenie na skrzynię techniką Poliquin z palcami stopy ku dołowi intensywnie angażuje czworogłowe.', tips:['Palce stopy skierowane w dół','Praca tylko z przedniej nogi','Pełny wyprost na górze'], mistakes:['Odpychanie tylną nogą','Za niska skrzynka','Brak pełnego wyprostu'] },
  'p209':{ desc:'Wznosy łydek w marszu to dynamiczna wersja. Chódź na palcach przez określony dystans.', tips:['Chódź na palcach','Pełny wyprost łydki na każdym kroku','Utrzymaj rytm'], mistakes:['Lądowanie na pełnej stopie','Za krótki dystans','Brak pełnego wyprostu'] },
  'p210':{ desc:'Wznosy łydek na maszynie siedzącej to izolacja łydek z kontrolowanym torem.', tips:['Reguluj siedzisko','Pełny zakres ruchu','Powolna ekscentryka'], mistakes:['Zła regulacja','Za mały zakres','Za szybkie tempo'] },
  'p212':{ desc:'Wykroki wsteczne TRX z przednią nogą w taśmach angażują czworogłowe i stabilizatory.', tips:['Nogi w pętlach TRX','Krok w tył','Tułów pionowy'], mistakes:['Brak stabilizacji','Za mały krok','Kolana do środka'] },
  'p213':{ desc:'Przysiad TRX trzymając taśmy wspiera prawidłową technikę przysiadową.', tips:['Trzymaj taśmy dla równowagi','Kolana ku palcom','Pełna głębokość'], mistakes:['Za mocne opieranie na taśmach','Kolana do środka','Za mały zakres'] },
  'p214':{ desc:'Wykrok zawieszony TRX z tylną nogą w taśmach to wersja bułgarskiego z TRX.', tips:['Tylna noga w pętlach','Szerokie ustawienie','Pełny zakres ruchu'], mistakes:['Za blisko słupka','Kolano wysuwa się','Brak stabilizacji'] },
  'p215':{ desc:'Przysiad Zercher ze sztangą w zagięciach łokci. Obciąża core i czworogłowe inaczej.', tips:['Sztanga w zagięciach łokci','Tułów bardziej pionowy','Core napięty'], mistakes:['Ból łokci — użyj osłony','Za duże obciążenie','Zaokrąglone plecy'] },
  'p217':{ desc:'Przysiad bułgarski Zercher łączy pozycję bułgarską ze sztangą w zagięciach łokci.', tips:['Tylna noga na ławce','Sztanga w łokciach','Core napięty'], mistakes:['Ból łokci','Za duże obciążenie','Za blisko ławki'] },
  'p234':{ desc:'Pajacyki (jumping jacks) to klasyczne cardio angażujące nogi i ramiona. Wyskakuj rozkładając nogi i ręce.', tips:['Miękkie lądowanie','Utrzymaj rytm','Zacznij od krótkiej serii'], mistakes:['Twarde lądowanie','Zbyt wolny rytm','Brak synchronizacji'] },
  'p235':{ desc:'Bieżnia to klasyczne cardio dla każdego. Dostosuj prędkość i nachylenie do kondycji.', tips:['Właściwa prędkość','Dobra technika biegu','Nie trzymaj boków bieżni'], mistakes:['Zbyt szybka prędkość na starcie','Trzymanie boków','Brak lekkiego pochylenia do przodu'] },
  'p236':{ desc:'Rzut piłką lekarską (wall ball) łączy przysiad z rzutem. Z dołu przysiadu rzucaj piłkę w ścianę.', tips:['Głęboki przysiad','Eksplozja do rzutu','Odpowiednia waga piłki'], mistakes:['Za mały przysiad','Brak eksplozji','Za ciężka piłka'] },
  'p237':{ desc:'Przysiad przy ścianie to statyczne utrzymanie pozycji przysiadowej. Kolana 90°, plecy przy ścianie.', tips:['Kolana 90°','Plecy przy ścianie','Oddychaj miarowo'], mistakes:['Za mały kąt kolan','Plecy oderwane od ściany','Zbyt krótki czas'] },
  'p258':{ desc:'Wykrok z wyciskaniem kettlebell łączy ruch nóg z pracą barków. Krok do przodu i wyciśnij kettlebell.', tips:['Kettlebell w jednej ręce','Krok do przodu','Wyciśnij na górze ruchu'], mistakes:['Brak synchronizacji','Za ciężkie kettlebell','Niestabilna stabilizacja'] },
  'p259':{ desc:'Wykrok wsteczny z wyciskaniem kettlebell angażuje nogi i barki naprzemiennie.', tips:['Krok do tyłu','Wyciśnij ku górze','Naprzemiennie obie strony'], mistakes:['Brak synchronizacji','Za ciężkie kettlebell','Kolana do środka'] },

  // ── POŚLADKI p-seria ──
  'p171':{ desc:'Odwodzenie bioder leżąc na boku angażuje pośladek średni. Unoś górną nogę do boku.', tips:['Ciało w prostej linii bocznej','Kontroluj opuszczanie','Ściśnij pośladek na górze'], mistakes:['Rotacja bioder','Za mały zakres','Zbyt szybkie tempo'] },
  'p172':{ desc:'Wyprost biodra leżąc na brzuchu angażuje pośladek wielki. Unoś prostą nogę ku górze.', tips:['Napięty pośladek','Kontrolowany ruch','Obie strony równo'], mistakes:['Za szybkie tempo','Zbyt wysoko unoś','Brak napięcia pośladka'] },
  'p173':{ desc:'Marsz na pośladkach (glute march) angażuje pośladki w mostku biodrowym z ruchem naprzemiennych nóg.', tips:['Biodra uniesione przez cały czas','Naprzemienny ruch nóg','Ściśnij pośladki'], mistakes:['Opadające biodra','Za szybkie tempo','Brak napięcia'] },
  'p176':{ desc:'Dociskanie piętą angażuje pośladki. Leż i dociskaj pięty do podłogi unosząc biodra.', tips:['Pięty mocno w podłogę','Pełny wyprost bioder','Napięte pośladki'], mistakes:['Odrywające się pięty','Za mały zakres','Zbyt szybkie tempo'] },
  'p179':{ desc:'Odwodzenie bioder angażuje pośladek średni i mały. Może być stojąc, leżąc lub na maszynie.', tips:['Kontrolowany ruch','Ściskaj pośladek na górze','Obie strony równo'], mistakes:['Za szybkie tempo','Za mały zakres','Kompensacja tułowiem'] },
  'p180':{ desc:'Wyprost biodra to ruch wyprostu w stawie biodrowym angażujący pośladki.', tips:['Pełny wyprost','Napięty pośladek','Kontrolowany powrót'], mistakes:['Za mały zakres','Za szybkie tempo','Brak napięcia'] },
  'p181':{ desc:'Hip thrust z masą ciała lub obciążeniem na biodrach. Barki na ławce, pchaj biodra ku górze.', tips:['Barki na ławce','Pełny wyprost bioder','Ściśnij pośladki'], mistakes:['Za mały zakres','Wygięty kręgosłup','Zbyt szybkie tempo'] },
  'p193':{ desc:'Unoszenie nogi w bok stojąc angażuje pośladek średni. Stabilna pozycja stojąca.', tips:['Stabilna pozycja','Kontrolowany ruch','Ściskaj pośladek na górze'], mistakes:['Przechylanie tułowia','Za duże unoszenie','Zbyt szybkie tempo'] },
  'p195':{ desc:'Odwodzenie biodra w leżeniu bokiem angażuje pośladek średni i mały.', tips:['Ciało w prostej linii bocznej','Pełny zakres ruchu','Ściskaj pośladek na górze'], mistakes:['Rotacja bioder','Za mały zakres','Za szybkie tempo'] },
  'p232':{ desc:'Mostek biodrowy na TRX z nogami w taśmach — trudniejsza wersja angażująca stabilizatory.', tips:['Nogi w pętlach TRX','Pełny wyprost bioder','Ściskaj pośladki'], mistakes:['Opadające biodra','Brak stabilizacji','Za szybkie tempo'] },
  'p238':{ desc:'Naprzemianstronny swing kettlebell angażuje pośladki z rotacją. Eksplozja bioder przy każdym swingu.', tips:['Eksplozja bioder','Kontrolowana rotacja','Obie ręce aktywne'], mistakes:['Brak eksplozji','Za duże kettlebell','Brak kontroli'] },
  'p248':{ desc:'Swing clean kettlebell łączy swing z przejściem na bark. Angażuje pośladki i barki.', tips:['Eksplozja bioder','Płynne przejście do barku','Stabilna pozycja'], mistakes:['Brak eksplozji','Niestabilne lądowanie','Za duże kettlebell'] },
  'p261':{ desc:'Swing clean kettlebell to połączenie swinga i zarzutu na bark.', tips:['Eksplozja bioder','Płynne przejście','Stabilna pozycja końcowa'], mistakes:['Brak eksplozji','Niestabilne lądowanie','Za duże kettlebell'] },
  'p264':{ desc:'Swing kettlebell jedną ręką to jednostronny swing. Wymaga większej stabilizacji core.', tips:['Eksplozja bioder','Stabilny core','Obie strony równo'], mistakes:['Brak eksplozji','Rotacja tułowia','Za duże kettlebell'] },

  // ── PLECY olimpijskie p-seria ──
  'p216':{ desc:'Martwy ciąg Zercher ze sztangą w zagięciach łokci. Zaawansowany wariant angażujący core i biceps.', tips:['Bezpieczne zagięcia łokci','Kręgosłup neutralny','Małe obciążenie na starcie'], mistakes:['Zbyt duże obciążenie','Zaokrąglone plecy','Ból łokci'] },
  'p240':{ desc:'Zarzut (clean) to podniesienie sztangi na barki jednym ruchem. Wymaga trenera i miesięcy nauki.', tips:['Ucz się od trenera','Zacznij od pustej sztangi','Technika przed obciążeniem'], mistakes:['Zła technika — kontuzja','Zbyt duże obciążenie','Brak rozgrzewki'] },
  'p241':{ desc:'Zarzut i wyciskanie łączy clean z press. Kompleksowe ćwiczenie wymagające opanowania obu ruchów.', tips:['Opanuj każdą część osobno','Progresja od podstaw','Eksplozja bioder w zarzucie'], mistakes:['Łączenie bez opanowania części','Zbyt duże obciążenie','Brak techniki'] },
  'p242':{ desc:'Podciąg do zarzutu angażuje plecy i biodra eksplozywnie. Ćwiczenie pomocnicze do cleanów.', tips:['Eksplozja bioder','Bar blisko ciała','Stań wysoko na palcach na górze'], mistakes:['Bar za daleko','Brak eksplozji','Za wolny ruch'] },
  'p243':{ desc:'Podciąg zarzutu to ćwiczenie pomocnicze trenujące fazę podciągu w cleanach.', tips:['Skupiaj się na fazie podciągu','Bar blisko nóg','Eksplozja w górę'], mistakes:['Bar za daleko','Brak eksplozji','Zbyt wolne'] },
  'p244':{ desc:'Martwe podnoszenie dwóch kettlebell angażuje plecy i pośladki.', tips:['Kręgosłup neutralny','Eksplozja bioder na górze','Kettlebell blisko ciała'], mistakes:['Zaokrąglone plecy','Kolana do środka','Zbyt duże kettlebell'] },
  'p245':{ desc:'Martwe rwanie nożycowe z dwoma kettlebell angażuje plecy i koordynację.', tips:['Stopa w pozycji wykroku','Kręgosłup neutralny','Eksplozja na górze'], mistakes:['Brak stabilizacji','Zaokrąglone plecy','Zbyt duże kettlebell'] },
  'p249':{ desc:'Zarzut z podwieszenia z hantlami to eksplozywny trening pleców i ramion.', tips:['Hantle na poziomie kolan na starcie','Eksplozja bioder','Szybkie podsiady'], mistakes:['Brak eksplozji','Hantle za daleko','Zbyt wolne podsiady'] },
  'p251':{ desc:'Zarzut siłowy z hantlami to eksplozywne podniesienie hantli na barki.', tips:['Eksplozja bioder','Hantle blisko ciała','Szybkie podsiady'], mistakes:['Brak eksplozji','Za wolny ruch','Hantle za daleko'] },
  'p253':{ desc:'Rwanie z hantlem jedną ręką to uproszczone ćwiczenie olimpijskie. Hantel trafia nad głowę jednym ruchem.', tips:['Eksplozja bioder','Hantel blisko ciała','Stabilne lądowanie'], mistakes:['Brak eksplozji','Hantel za daleko','Niestabilne lądowanie'] },
  'p254':{ desc:'Zarzut z podwieszenia (hang clean) startuje ze sztangą zawieszoną na poziomie kolan.', tips:['Eksplozja bioder','Bar blisko ciała','Szybkie podsiady'], mistakes:['Bar za daleko','Brak eksplozji','Wolne podsiady'] },
  'p255':{ desc:'Rwanie z podwieszenia startuje ze sztangą na poziomie kolan do pozycji nad głową.', tips:['Eksplozja bioder','Bar blisko ciała','Stabilne lądowanie'], mistakes:['Bar za daleko','Brak eksplozji','Niestabilne lądowanie'] },
  'p256':{ desc:'Zarzut i wyciskanie kettlebell to kompleksowe ćwiczenie na całe ciało.', tips:['Eksplozja bioder','Kettlebell blisko ciała','Stabilne wyciskanie'], mistakes:['Brak eksplozji','Zbyt duże kettlebell','Niestabilne lądowanie'] },
  'p257':{ desc:'Martwy ciąg z kettlebell to trening na plecy i pośladki z kettlebell między stopami.', tips:['Kettlebell między stopami','Kręgosłup neutralny','Eksplozja bioder'], mistakes:['Zaokrąglone plecy','Kolana do środka','Zbyt duże kettlebell'] },
  'p265':{ desc:'Rwanie siłowe (power snatch) to uproszczona wersja rwania bez pełnego kucania.', tips:['Eksplozja bioder','Bar blisko ciała','Stabilne lądowanie'], mistakes:['Bar za daleko','Brak eksplozji','Niestabilne lądowanie'] },
  'p266':{ desc:'Kombinowane wiosłowanie z hantlami naprzemiennie angażuje plecy z kontrolowaną rotacją.', tips:['Naprzemiennie obie ręce','Kontrolowana rotacja','Stabilny core'], mistakes:['Zbyt duża rotacja','Wzruszanie barkami','Zbyt szybkie tempo'] },

  // ── ŁYDKI p-seria ──
  'p165':{ desc:'Wznosy łydek w opadzie (donkey calf raise) z pochylonym tułowiem dają doskonałe rozciągnięcie łydek.', tips:['Tułów poziomy lub pochylony','Pełny zakres ruchu','Powolna ekscentryka'], mistakes:['Za mały zakres','Za szybkie tempo','Brak rozciągnięcia na dole'] },
  'p200':{ desc:'Wznosy łydek na saniach to eksplozywna wersja. Wypychaj sanie siłą łydek.', tips:['Eksplozywny ruch','Pełny wyprost łydki','Kontroluj sanie'], mistakes:['Brak eksplozji','Za małe obciążenie','Brak kontroli'] },
  'p202':{ desc:'Wznosy łydek w suwnicy Smitha z kontrolowanym torem ruchu.', tips:['Palce na krawędzi podwyższenia','Pełny zakres ruchu','Powolna ekscentryka'], mistakes:['Za mały zakres','Za szybkie tempo','Brak opuszczenia poniżej poziomu'] },
  'p207':{ desc:'Unoszenie palców stopy (tibialis raise) wzmacnia mięsień piszczelowy przedni. Ważny dla stabilizacji kolan.', tips:['Pięty na krawędzi','Unoś palce maksymalnie','Powolny ruch'], mistakes:['Za małe unoszenie','Za szybkie tempo','Zbyt rzadko wykonywane'] },
  'p209':{ desc:'Wznosy łydek w marszu to dynamiczna wersja. Chódź na palcach przez określony dystans.', tips:['Chódź na palcach','Pełny wyprost łydki','Utrzymaj rytm'], mistakes:['Lądowanie na pełnej stopie','Za krótki dystans','Brak pełnego wyprostu'] },
  'p210':{ desc:'Wznosy łydek na maszynie siedzącej to izolacja łydek z kontrolowanym torem.', tips:['Reguluj siedzisko','Pełny zakres ruchu','Powolna ekscentryka'], mistakes:['Zła regulacja','Za mały zakres','Za szybkie tempo'] },

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
