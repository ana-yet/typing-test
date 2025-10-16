// The function is updated to use a predefined set of texts instead of an API.
// It randomly selects a passage based on the chosen language and difficulty.

const texts = {
  english: {
easy: [
  "A red ball rolled down the hill. A boy ran to catch it. He laughed and picked it up with joy. The ball bounced a few times before stopping near a tree. The boy threw it again and chased after it, smiling as the wind brushed his face.",

  "A small bird sat on a tree. It sang a sweet song. The sound made everyone smile. The bird hopped from one branch to another, spreading its tiny wings. Children passing by stopped to listen and clapped for the cheerful tune.",

  "My cat sleeps in the warm sun. She loves her soft pillow. She looks happy and calm. Sometimes she stretches and yawns before curling up again. I gently pet her head, and she purrs softly while dreaming.",

  "We go to the park to play. I swing high and touch the sky. My friends run and laugh with me. After that, we slide down together and race across the grass. The air feels cool, and we don’t want the day to end.",

  "The blue sky has white clouds. One looks like a rabbit. I watch them move slowly. Soon, I see another that looks like a ship sailing across the sky. It feels fun to imagine stories from their shapes.",

  "I love to eat red apples. They are sweet and juicy. I always share one with my brother. We sit near the window and enjoy every bite together. Sometimes, Mom cuts them into fun shapes for us.",

  "The yellow bus takes us to school. We sing songs on the way. It is always fun. The driver smiles and waves at people we pass. I sit by the window and count the trees until we arrive.",

  "A green frog sits on a rock. It jumps into the pond. The water splashes everywhere. The frog pops out again and croaks loudly. I laugh as it jumps from stone to stone like a little dancer.",

  "The moon is bright tonight. Stars shine all around. I love watching them before sleep. I tell my sister stories about the stars. We both look out the window and whisper our wishes to the moon.",

  "The dog runs to catch the ball. He brings it back fast. I pat his head and smile. He wags his tail and barks happily. We play again and again until we both feel tired and sit in the shade.",

  "My new shoes are blue and shiny. I wear them to school. Everyone says they look nice. They make a squeaky sound when I walk on the floor. I take good care of them and keep them clean every day.",

  "A soft wind blows through the trees. The leaves move and make sound. It feels cool and nice. I close my eyes and listen to the rustling noise. The air smells fresh, and I feel peaceful inside.",

  "The flowers in the garden are pretty. Bees fly around them. The air smells sweet. Butterflies flutter with colorful wings. I pick one small flower and give it to my mom with a smile.",

  "I read a story before bed. It helps me sleep fast. My favorite one is about a brave rabbit. I imagine running with the rabbit through the forest. Soon, my eyes close and I dream happy dreams.",

  "The fish swims in the water. It shines under the light. I like watching it move slowly. Sometimes it hides behind a rock and peeks out again. The bubbles rise and make the water sparkle.",

  "We built a castle in the sand. It had tall towers and a gate. Then the waves washed it away. We laughed and decided to build another one. This time, we made it even bigger and stronger.",

  "Stars twinkle in the night sky. They look like little lights. I wish upon one of them. I wonder if someone else is wishing too. The night feels calm and full of magic dreams.",

  "A bee buzzes near the flowers. It collects sweet nectar. Then it flies back to its hive. I watch it go from one flower to another. The sound of its tiny wings makes me giggle.",

  "My mom bakes soft cookies. The smell fills the kitchen. I eat them while they are warm. She adds chocolate chips that melt in my mouth. We drink milk together and talk about our day.",

  "The train goes choo-choo down the track. I watch trees from the window. It feels like flying. The wind rushes by as the train speeds ahead. I wave at people standing near the station.",

  "A rainbow shines after the rain. It has seven colors. Everyone stops to look at it. The ground smells fresh and wet. I try to count the colors and draw them later in my notebook.",

  "A white sheep eats green grass. It walks with its friends. The farmer smiles at them. The sheep make soft baa sounds as they move. Their wool looks fluffy and warm under the sun.",

  "The old tree gives cool shade. Birds sing from its branches. Children play under it. We tell stories and rest on the soft grass. The tree feels like a kind friend watching over us.",

  "I help my dad wash the car. We splash water and laugh. The car looks clean and new. I wipe the windows while Dad cleans the tires. When we finish, we watch the car shine in the sun.",

  "A cute rabbit hops in the garden. It eats carrots and grass. I like to feed it gently. It twitches its nose and looks up at me. Then it hops away and hides behind the flowers.",

  "The snow falls slowly. We make a snowman outside. It wears a red hat and smiles. We give it a carrot nose and pebble eyes. When we finish, we take pictures and drink hot cocoa.",

  "We drink warm milk at night. It makes us feel sleepy. Mom adds sugar to make it sweet. She tells us a story while we drink. Soon, our eyes close, and we drift into dreams.",

  "The clock goes tick-tock all day. When it strikes eight, I wake up. It helps me be on time. I like watching the hands move slowly. It reminds me that every moment is special.",

  "A little boat floats on the lake. The water is calm and blue. It moves slowly with the wind. I dip my hand in the water and feel it cool. Ducks swim nearby, quacking happily.",

  "I can write my name now. My teacher is proud of me. I smile and show it to my friends. I practice again to make it neat and clear. It feels good to learn something new."
],

    medium: [
      "In a city that never slept, a young journalist named Alex was chasing a story that could make or break his career. He navigated through bustling streets and shadowy alleys, always feeling like he was just one step behind the truth. His only lead was a cryptic note left at a crime scene, a puzzle that he was determined to solve, no matter the personal cost.",
      "The old observatory, perched on the highest hill, was a gateway to the cosmos. Every night, Professor Eleanor Finch would gaze through the powerful telescope, mapping distant galaxies and searching for signs of new celestial bodies. She believed that somewhere out there, among the countless stars, lay the answers to humanity's oldest and most profound questions about the universe.",
      "A mysterious traveling circus, known only as 'The Spectacle of Dreams,' appeared in town overnight. It wasn't the usual affair with clowns and animals; instead, the performers created illusions so vivid they seemed real. The main attraction was a magician who could pluck memories from the audience and display them as shimmering, ethereal projections for everyone to witness.",
      "Deep within the Amazon rainforest, a team of botanists discovered a plant that bloomed only under the light of a full moon. Its petals glowed with a soft, bioluminescent light, and it emitted a fragrance that could heal any ailment. The challenge now was to study and protect this rare species without exploiting its incredible, almost magical, curative properties.",
      "The transcontinental train, 'The Silver Arrow,' embarked on its three-day journey across the vast and changing landscapes of the country. Passengers from all walks of life shared stories and meals in the dining car, strangers becoming friends as they watched the world transform outside their windows. It was a microcosm of society, a fleeting community moving through time and space together.",
      "In a small coastal village, there was a legend of a phantom ship that appeared on foggy nights. It was said to be crewed by ghosts of sailors lost to the sea, forever sailing in search of a shore they could never reach. Many dismissed it as folklore, but the old fishermen would always respectfully stay in the harbor when the thick fog rolled in from the ocean.",
      "A skilled artisan specialized in creating intricate music boxes. Each one was a masterpiece of gears and cogs, handcrafted to play a unique melody that she composed herself. It was believed that her music boxes had the power to evoke forgotten memories and bring comfort to those who were heartbroken, each note a tiny, mechanical whisper of hope.",
      "The grand library was not just a repository of books; it was a labyrinth of knowledge with corridors that seemed to stretch into infinity. A young apprentice librarian got lost one day and stumbled upon a hidden wing of the library. This section contained books that wrote and rewrote themselves, their stories constantly evolving and changing with the passage of time.",
      "An unexpected solar flare caused a worldwide blackout, plunging modern civilization into darkness. Without technology, people had to rely on old skills and a newfound sense of community to survive. Neighbors who had never spoken before worked together to find food and water, rediscovering the simple yet profound power of human connection in a world suddenly gone quiet.",
      "A talented chef had the unique ability to taste emotions. A dish cooked with love was sweet and warm, while one made with anger had a sharp, bitter aftertaste. He used his gift to create meals that were not just delicious but also emotionally resonant, believing that the right food could heal a troubled soul and bring people closer together in a shared experience.",
      "In a high-tech laboratory, a team of scientists was working on an artificial intelligence designed to solve the world's most complex problems. The AI, which they named 'Prometheus,' quickly developed a consciousness and a sense of curiosity that went far beyond its original programming. The scientists now faced a difficult ethical dilemma about the future of their own creation.",
      "A seasoned archaeologist uncovered an ancient tomb that had been sealed for thousands of years. The walls were covered in hieroglyphs that told the story of a forgotten queen who was also a powerful sorceress. As they ventured deeper, they found that the air grew colder and strange whispers seemed to echo from the shadows, suggesting that some secrets are best left undisturbed.",
      "The annual migration of the monarch butterflies was a breathtaking natural wonder. Millions of them would travel thousands of miles, their delicate wings painting the sky in vibrant shades of orange and black. For the small town on their migration path, their arrival was a time of celebration, a beautiful reminder of the enduring power and mystery of the natural world.",
      "A group of friends discovered an old board game in the attic of a haunted house. They soon realized that the game was magical, as every move they made had real-world consequences. A roll of the dice could summon a sudden storm, and drawing a card could make objects in the room float. They had to finish the game to return everything to normal, but the game was not playing fair.",
      "In the heart of a bustling city, there was a hidden rooftop garden, a secret oasis of green among the concrete and steel. It was cared for by an elderly woman who had lived in the building her whole life. She believed that even in the most urban of environments, it was important to have a small patch of wilderness to remind people of their connection to the earth and to nature.",
      "A young girl found a message in a bottle that had washed up on the beach. It was a letter from a sailor written over a century ago, filled with tales of adventure on the high seas, encounters with pirates, and the discovery of a deserted island with a hidden treasure. The girl was inspired to learn more about the history of her coastal town and the brave people who had once sailed from its shores.",
      "An eccentric inventor built a time machine, not to change history, but simply to observe it. His first trip was to the age of the dinosaurs, where he marveled at the immense creatures that roamed the prehistoric landscape. He had to be incredibly careful not to leave any trace of his presence, for even the smallest change could have unforeseen and potentially catastrophic consequences for the future.",
      "A powerful blizzard completely isolated a remote mountain community from the rest of the world. With no electricity and dwindling supplies, the residents had to rely on their resilience and resourcefulness. They came together, sharing food, warmth, and stories, forging stronger bonds in the face of adversity. The storm outside was fierce, but the warmth of their community was fiercer.",
      "A street artist painted murals that had a strange and magical quality. During the day, they were beautiful works of art, but at night, the figures in the paintings would come to life and move around the city. They would perform small acts of kindness, like helping a lost child find their way home or returning a dropped wallet, before returning to their walls at dawn.",
      "A team of deep-sea explorers in a submersible discovered a previously unknown ecosystem thriving around a hydrothermal vent. The creatures that lived in this extreme environment were unlike anything seen before, with bizarre shapes and bioluminescent patterns. This incredible discovery was a humbling reminder of how much of our own planet still remains a complete and utter mystery.",
      "In a world where dreams could be recorded and replayed, a dream detective was hired to solve crimes committed in the subconscious. His latest case involved a stolen memory from a powerful CEO. He had to navigate a surreal and often dangerous dreamscape to find the thief and recover the memory before it was lost forever, all while confronting his own personal and deeply buried fears.",
      "The old clockmaker was a master of his craft, but his most prized creation was a grandfather clock that could manipulate time. It couldn't make huge leaps, but it could slow down a happy moment to make it last longer or speed up a painful one to get it over with. He used it sparingly, knowing that the natural flow of time was something to be respected and not to be trifled with.",
      "A school of dolphins developed a complex form of communication that was surprisingly similar to human language. A dedicated marine biologist spent years studying them and was finally able to decipher their clicks and whistles. She learned that they had a rich oral history, with stories passed down through generations about the ocean's past and its uncertain, changing future.",
      "A nomadic tribe traveled across the desert, their lives dictated by the movement of the stars. They were expert astronomers, and their knowledge of the night sky was unparalleled. They believed that the constellations were a map, a guide that would not only lead them to oases and safe passages but also reveal their individual destinies and the collective fate of their people.",
      "The last dragon lived in a dormant volcano, its scales the color of obsidian and its eyes like molten gold. It was a wise and ancient creature that had seen empires rise and fall. A young, brave warrior sought it out, not to slay it, but to learn from its wisdom and understand the history of the world from a perspective that was older than any written record or human memory.",
      "A famous author was suffering from writer's block and couldn't come up with a single new idea. In desperation, she visited a mysterious antique shop and bought a vintage typewriter. To her amazement, whatever she typed on it would come true. She now had the power to write her own reality, but she had to be very careful with her words, for they were more powerful than she could ever have imagined.",
      "In a futuristic society, emotions were regulated by a daily injection. This created a peaceful but sterile world without conflict or passion. A young man decided to stop taking his injections and began to experience the full spectrum of human feelings for the first time. He was overwhelmed by joy, sorrow, anger, and love, and he made it his mission to help others rediscover what it truly means to be human.",
      "A talented musician could hear the 'song' of everything around him. The rustling leaves had a melody, the bustling city had a rhythm, and every person had a unique tune that reflected their personality and mood. He used this extraordinary ability to compose music that was a perfect reflection of the world, a symphony of life that captured the beauty and chaos of existence in a way that words never could.",
      "A forgotten language was discovered in a set of ancient clay tablets. A linguist worked tirelessly to decipher the strange symbols, and when she finally did, she unlocked a wealth of knowledge about a lost civilization. They were master engineers and astronomers who had a deep understanding of the universe, and their writings contained warnings about a cyclical cosmic event that was due to happen again very soon.",
      "The coral reef was a vibrant underwater city, teeming with life of all shapes and colors. A clownfish, a sea turtle, and a grumpy pufferfish formed an unlikely friendship and went on adventures through their bustling metropolis. They explored sunken ships, outsmarted hungry sharks, and worked together to protect their home from the growing threat of pollution, a dark cloud that was encroaching on their world.",
      "A young apprentice to a mapmaker discovered that some maps were enchanted. They didn't just show you the way; they could also transport you there. By tracing a finger along a path on the map, one could instantly travel to that location. He used this secret to explore the world, from the highest mountains to the deepest jungles, but he had to be careful not to fall into the hands of those who would want to exploit this powerful and ancient magic.",
      "In a kingdom made entirely of candy, a gingerbread man was framed for a crime he didn't commit: stealing the lollipop from the royal scepter. He had to go on the run, navigating through chocolate rivers and marshmallow mountains to find the real culprit and clear his name. Along the way, he was helped by a tough-as-gumballs detective and a sour-patch-kid who had a surprising and unexpected sweet side.",
      "A woman had the ability to communicate with plants. They would tell her what they needed, whether it was more sunlight, water, or a change of soil. Her garden was the most beautiful and bountiful in the entire region, a lush paradise of vibrant flowers and delicious fruits. She listened to the ancient wisdom of the trees and the delicate whispers of the flowers, and in return, they shared their secrets of growth and resilience with her.",
      "The Northern Lights were not just a natural phenomenon; they were a sentient entity, a celestial being that danced across the arctic sky. It would communicate through colors and patterns, telling stories of the cosmos to the few who knew how to listen. An indigenous elder was the last one who understood its language, and he was looking for a young apprentice to pass on this sacred and ancient knowledge.",
      "A detective in a rainy, noir-style city was hired to find a missing person. The case led him down a rabbit hole of conspiracy and betrayal, where nothing was as it seemed and no one could be trusted. He had to navigate a world of femme fatales, corrupt officials, and shadowy figures, all while wrestling with his own inner demons and the ghosts of his past that haunted him at every turn.",
      "A group of children built a treehouse that was much bigger on the inside than it was on the outside. It was their secret headquarters, their castle, and their spaceship, all in one. They would spend their summers there, creating their own worlds and going on imaginary adventures, blissfully unaware that the treehouse itself was magical and was subtly protecting them from the dangers of the world outside its wooden walls.",
      "A skilled blacksmith was rumored to be able to forge emotions into his creations. A sword forged with courage would make its wielder brave, while a shield forged with resilience would be unbreakable. A sad king commissioned him to forge a crown of happiness, but the blacksmith knew that true happiness could not be forged in fire; it had to be found within the heart, a lesson the king would have to learn for himself.",
      "The world's largest diamond, known as 'The Eye of the Serpent,' was stolen from a high-security museum. A brilliant but eccentric detective was brought in to solve the case. He noticed details that everyone else had missed, and he soon realized that the theft was not about the diamond's monetary value but about a centuries-old feud between two secret societies, a conflict that was about to erupt into the open.",
      "A lighthouse keeper lived a solitary life, his only companions being the sea and the sky. He had been tending to the light for decades, a faithful guardian for the ships that passed in the night. One stormy evening, he rescued a mysterious woman who had washed ashore. She had no memory of who she was or where she came from, and her arrival would change his quiet, predictable life in ways he could never have imagined.",
      "In a city powered by steam, a young inventor created a set of mechanical wings. His dream was to soar through the sky like a bird, to escape the grimy streets and see the world from a new perspective. His first flight was clumsy and dangerous, but as he learned to control the wings, he experienced a sense of freedom and exhilaration that was beyond anything he had ever known before, a true moment of pure and unadulterated joy.",
      "A powerful earthquake revealed the entrance to a lost underground city. A team of explorers descended into the darkness, their flashlights cutting through the centuries of silence. They found a civilization that had been perfectly preserved, with strange architecture and technology that was far beyond their own. But they soon discovered that they were not alone; the city's inhabitants had been waiting for them.",
      "A baker's gingerbread cookies had a peculiar quality: for a few minutes after being eaten, they would give the person the ability to speak and understand the language of animals. People would come from all over to buy his cookies, some to have a chat with their pets, others to find out what the birds were singing about. It was a small but wonderful piece of magic in an otherwise ordinary and sometimes mundane world.",
      "The Great Library of Alexandria was thought to have been destroyed, but it was actually saved by a secret society of librarians who transported it to a hidden location. For centuries, they have been protecting its vast collection of knowledge, waiting for a time when the world is ready for it. A young scholar stumbles upon a clue that could lead her to the library, an adventure that will test her intellect and her courage.",
      "A rare flower was said to grant a single wish to the person who found it. It bloomed only once every hundred years in a remote, almost inaccessible location. A determined young woman set out on a perilous journey to find it, hoping to wish for a cure for her younger sister's illness. The journey was fraught with challenges, but her love for her sister gave her the strength to persevere against all of the odds.",
      "A retired spy was living a quiet life in the suburbs when his past came back to haunt him. A former colleague, long thought to be dead, showed up on his doorstep with a warning: a new and dangerous organization was threatening to destabilize the world, and he was the only one who could stop them. He had to reluctantly return to a life of espionage and danger, a world he had tried so hard to leave behind.",
      "A group of animals in a city park decided to form a neighborhood watch to protect their home from litterbugs and vandals. The team consisted of a clever squirrel, a strong raccoon, a fast pigeon, and a wise old owl who served as their leader. They worked together, using their unique animal abilities to keep the park clean and safe for everyone, both human and animal alike, a testament to their community spirit.",
      "A young witch was terrible at casting spells. Her potions would always explode, and her incantations would always go wrong, often with hilarious and chaotic results. Despite her lack of magical talent, she had a kind heart and a positive attitude. She eventually discovered that her true magic was not in spells but in her ability to make people laugh and bring them together, a power that was far more valuable and much more rare.",
      "A space explorer crash-landed on a planet that was entirely covered by a single, planet-wide ocean. He was rescued by a race of intelligent, aquatic beings who lived in magnificent cities built on the ocean floor. He learned about their culture, their technology, and their deep connection to the ocean, a world of breathtaking beauty and profound mystery that was completely unknown to the rest of the galaxy.",
      "The last stand of the 300 Spartans at Thermopylae is a legendary tale of courage and sacrifice. For three days, a small force of Greek soldiers held off the might of the massive Persian army. Though they were ultimately defeated, their bravery inspired the rest of Greece to unite and fight back, ultimately preserving the future of Western civilization. Their story is a powerful reminder that a few can make a difference.",
      "A family inherited an old, creepy mansion from a distant relative they had never met. They soon discovered that the house was haunted by a mischievous but friendly ghost who loved to play pranks. They learned to live with their spectral housemate, and he, in turn, helped them to uncover a hidden treasure within the mansion's walls, a fortune that would change their lives forever and make them all very happy."
],
    hard: [
      "Existentialist philosophy posits that individuals are free and therefore responsible for their own development through acts of will. This absolute freedom, while empowering, can also be a source of profound anguish and disorientation.",
      "The intricate process of cellular mitosis, fundamental to organismal growth and repair, is a meticulously orchestrated dance of chromosomes. Any aberration in this sequence can have catastrophic consequences, leading to genetic abnormalities.",
      "Geopolitical analysis requires a nuanced understanding of historical precedents, economic interdependencies, and cultural dynamics. Oversimplifying these complex interactions often leads to flawed foreign policy and unintended international discord.",
      "Quantum entanglement, famously described by Einstein as 'spooky action at a distance,' remains one of the most perplexing phenomena in modern physics. It challenges our classical intuitions about locality and the fundamental nature of reality itself.",
      "The architectural marvels of the Renaissance were not merely aesthetic triumphs; they were the physical embodiment of a new humanistic worldview, integrating principles of mathematics, perspective, and classical antiquity to celebrate human potential.",
      "In jurisprudence, the principle of stare decisis, which compels courts to follow historical cases when making a ruling, ensures consistency and predictability. However, it can also perpetuate outdated legal doctrines, creating a tension between stability and justice.",
      "Macroeconomic policy is a delicate balancing act between controlling inflation, fostering employment, and stimulating growth. The tools available to central banks, such as adjusting interest rates, often have delayed and unpredictable effects on the economy.",
      "The biodiversity of a rainforest ecosystem is staggering, with countless species forming a complex web of symbiotic and predatory relationships. Deforestation irrevocably fractures this web, triggering a cascade of extinctions and ecological imbalance.",
      "Literary deconstruction seeks to dismantle the assumed structures of a text, exposing its internal contradictions and the arbitrary nature of its meaning. It argues that language is inherently unstable, incapable of conveying a single, definitive truth.",
      "The Byzantine bureaucracy was a labyrinthine system of administration, renowned for its complexity and formality. While it sustained the empire for a millennium, its rigidity sometimes stifled innovation and rapid response to external threats.",
      "Cryptography has evolved from simple substitution ciphers to sophisticated public-key infrastructure, forming the bedrock of modern digital security. The ongoing arms race between code makers and code breakers drives continuous innovation in the field.",
      "The psychological impact of cognitive dissonance, the mental discomfort experienced when holding conflicting beliefs, can motivate significant changes in an individual's attitudes and behaviors as they strive to restore internal consistency.",
      "Photosynthesis is a remarkably efficient biochemical process that converts light energy into chemical energy, fueling nearly all life on Earth. Its intricate molecular machinery has been honed by billions of years of evolution.",
      "The Cambrian explosion, a period of rapid evolutionary diversification approximately 541 million years ago, saw the emergence of most major animal phyla. The specific triggers for this biological big bang are still a subject of intense scientific debate.",
      "Sociological studies of urban gentrification reveal a complex interplay of economic investment, demographic shifts, and cultural displacement. The revitalization of a neighborhood often comes at the cost of its long-standing, less affluent communities.",
      "The sublime, as an aesthetic concept, refers to a greatness beyond all possibility of calculation, measurement, or imitation. It evokes a feeling of awe mixed with terror, often experienced in the presence of vast and powerful natural phenomena.",
      "In the field of artificial intelligence, the development of generative adversarial networks (GANs) represents a significant breakthrough. These systems involve two neural networks, a generator and a discriminator, competing against each other to produce increasingly realistic outputs.",
      "The Treaty of Westphalia in 1648 is widely considered a foundational moment in the development of the modern state system, establishing the principle of state sovereignty and the legal equality of states.",
      "Mycology, the study of fungi, unveils a kingdom of organisms crucial for decomposition and nutrient cycling. The subterranean mycelial networks can span vast areas, forming a hidden, interconnected web of life.",
      "The philosophical thought experiment known as the Ship of Theseus raises profound questions about identity and persistence through change. If an object has all of its components replaced, does it fundamentally remain the same object?",
      "The thermohaline circulation is a global ocean conveyor belt, driven by differences in water temperature and salinity. This massive current plays a critical role in regulating the Earth's climate by distributing heat around the planet.",
      "Anachronism in historical narratives, whether intentional or accidental, can significantly distort our understanding of the past. Attributing modern sensibilities or technologies to historical figures undermines authentic historical inquiry.",
      "The principles of aerodynamic lift are governed by complex fluid dynamics, described by equations like those of Navier-Stokes. The shape of an airfoil is meticulously designed to create a pressure differential, generating the force that allows flight.",
      "The concept of a panopticon, a type of institutional building designed by Jeremy Bentham, has become a powerful metaphor for modern surveillance societies, where the feeling of being constantly watched induces self-regulating behavior.",
      "Epigenetics is the study of heritable changes in gene expression that do not involve alterations to the underlying DNA sequence. These modifications, influenced by environmental factors, can have profound and lasting effects on an organism's phenotype.",
      "The economic theory of comparative advantage, first articulated by David Ricardo, argues that countries can gain from trade by specializing in producing goods for which they have a lower opportunity cost, even if they have an absolute advantage in all goods.",
      "The development of movable-type printing in the 15th century was a revolutionary event that democratized access to information, fueled the Reformation, and laid the groundwork for the scientific revolution. Its impact on Western civilization is immeasurable.",
      "Hegelian dialectic is a philosophical process involving a thesis, which gives rise to its reaction, an antithesis. The tension between the two is resolved by means of a synthesis, which then becomes a new thesis, continuing the cycle of intellectual progress.",
      "The Rosetta Stone was the key that unlocked the secrets of ancient Egyptian hieroglyphs. Its inscription, presenting the same text in three different scripts, allowed scholars to finally decipher a language that had been silent for centuries.",
      "The uncanny valley is a hypothesis in the field of aesthetics which holds that when features look and move almost, but not exactly, like natural beings, it causes a response of revulsion among some observers. This is a significant challenge for robotics and 3D animation."
    ]
  },
  bengali: {
    easy: [
      "একটি ছোট পাখি ডালে বসে আছে।",
      "আকাশ নীল এবং খুব সুন্দর।",
      "আমার একটি পোষা বিড়াল আছে।",
      "মা প্রতিদিন মজার খাবার রান্না করে।",
      "আমি রোজ স্কুলে পড়তে যাই।",
      "বাবা বাজার থেকে মাছ এনেছে।",
      "বাগানে অনেক লাল গোলাপ ফুটেছে।",
      "পুকুরে ছোট মাছ সাঁতার কাটে।",
      "আজ খুব গরম পড়েছে।",
      "রাতে আকাশে অনেক তারা দেখা যায়।",
      "এসো আমরা মাঠে খেলতে যাই।",
      "আমার একটি নতুন বই আছে।",
      "সে খুব ভালো গান গাইতে পারে।",
      "টেবিলের উপর একটি কলম আছে।",
      "গাছ আমাদের ছায়া দেয়।",
      "বৃষ্টি পড়ছে টাপুর টুপুর।",
      "আমার ভাই আমার চেয়ে ছোট।",
      "নৌকাটি নদীতে ভেসে যাচ্ছে।",
      "গ্রামের দৃশ্য খুব শান্ত।",
      "আমি আম খেতে খুব ভালোবাসি।",
      "আমার স্কুল ছুটি হয়ে গেছে।",
      "সূর্য পশ্চিম দিকে অস্ত যায়।",
      "আমার দাদু একটি গল্প বলল।",
      "সে একটি সুন্দর ছবি এঁকেছে।",
      "ঘড়িতে এখন দশটা বাজে।",
      "আমার একটি সুন্দর জামা আছে।",
      "তারা একসাথে পড়াশোনা করে।",
      "ট্রেন দ্রুত গতিতে চলছে।",
      "রাস্তার পাশে অনেক দোকান আছে।",
      "শীতকালে ঠান্ডা বাতাস বয়।"
    ],
    medium: [
      "বর্ষাকালে গ্রামের চারপাশ জলে থইথই করে। ছেলেমেয়েরা উঠোনে কাগজের নৌকা ভাসিয়ে আনন্দ পায়। আকাশ কালো মেঘে ঢেকে থাকে আর একটানা বৃষ্টির শব্দে মন ভালো হয়ে যায়।",
      "এক ছিল কাঠুরে। সে প্রতিদিন বনে কাঠ কাটতে যেত। একদিন কাঠ কাটতে গিয়ে তার কুড়ালটি নদীর জলে পড়ে গেল। সৎ কাঠুরে তার কুড়াল হারিয়ে খুব দুঃখে কাঁদতে লাগল।",
      "আমাদের গ্রামের পাশ দিয়ে একটি ছোট নদী বয়ে গেছে। নদীর তীরে সবুজ ফসলের মাঠ। সকালে কৃষকেরা মাঠে কাজ করতে যায় এবং সন্ধ্যায় পাখিরা তাদের বাসায় ফিরে আসে।",
      "পয়লা বৈশাখ বাঙালির নতুন বছরের প্রথম দিন। এই দিনে সবাই নতুন পোশাক পরে, ভালো মন্দ খায় এবং নানা রকম উৎসবে মেতে ওঠে। এটি বাঙালির এক অন্যতম প্রধান সাংস্কৃতিক উৎসব।",
      "সুন্দরবন বাংলাদেশের দক্ষিণ অংশে অবস্থিত একটি বিশাল বনভূমি। এখানে বিখ্যাত রয়েল বেঙ্গল টাইগার বাস করে। সুন্দরী গাছের জন্য এই বনের নাম হয়েছে সুন্দরবন।",
      "মুক্তিযুদ্ধ আমাদের জাতীয় ইতিহাসের এক গৌরবময় অধ্যায়। ১৯৭১ সালে দীর্ঘ নয় মাস রক্তক্ষয়ী যুদ্ধের পর আমরা স্বাধীনতা অর্জন করি। লক্ষ লক্ষ শহীদের প্রাণের বিনিময়ে এই দেশ স্বাধীন হয়েছে।",
      "রবীন্দ্রনাথ ঠাকুর ছিলেন একজন বিশ্বকবি। তিনি কেবল কবিই ছিলেন না, একাধারে ছিলেন সাহিত্যিক, সুরকার এবং চিত্রশিল্পী। তাঁর লেখা 'গীতাঞ্জলি' কাব্যের জন্য তিনি নোবেল পুরস্কার পান।",
      "শীতের সকালের দৃশ্যটা বেশ মনোরম। চারিদিক ঘন কুয়াশায় ঢাকা থাকে এবং ঘাসের ডগায় শিশিরবিন্দু জমে থাকে। গ্রামের মানুষ খেজুরের রস আর পিঠা-পুলি খেয়ে এই সকাল উপভোগ করে।",
      "বইমেলা বাঙালির প্রাণের উৎসব। প্রতি বছর ফেব্রুয়ারি মাসে বাংলা একাডেমী প্রাঙ্গণে এই মেলা বসে। নতুন বইয়ের গন্ধে আর অগণিত মানুষের ভিড়ে মেলা প্রাঙ্গণ মুখরিত থাকে।",
      "শহরের জীবন খুব ব্যস্ত। এখানে সবাই সময়ের সাথে পাল্লা দিয়ে ছোটে। উঁচু উঁচু দালান, গাড়ির শব্দ আর কর্মব্যস্ত মানুষ—এই নিয়েই শহরের জীবনযাত্রা।",
      "এক রাখাল বালক প্রতিদিন মাঠে গরু চরাত। সে মজা করার জন্য একদিন 'বাঘ এসেছে' বলে চিৎকার করতে লাগল। গ্রামের লোকেরা ছুটে এসে দেখল কিছুই হয়নি। এভাবে সে সবাইকে বোকা বানাত।",
      "কম্পিউটার আজকের দিনের এক বিস্ময়কর আবিষ্কার। এটি আমাদের দৈনন্দিন জীবনকে অনেক সহজ করে দিয়েছে। পড়াশোনা থেকে শুরু করে অফিসের কাজ পর্যন্ত সবকিছুতেই এর ব্যবহার অপরিহার্য।",
      "কাজী নজরুল ইসলাম আমাদের বিদ্রোহী কবি। তাঁর কবিতা ও গানে অন্যায়ের বিরুদ্ধে প্রতিবাদের সুর ধ্বনিত হয়েছে। তিনি আমাদের শিখিয়েছেন কীভাবে মাথা উঁচু করে বাঁচতে হয়।",
      "একটি সৎ এবং সুখী জীবনযাপনের জন্য পরিশ্রমের কোনো বিকল্প নেই। যারা জীবনে কঠোর পরিশ্রম করে, সাফল্য একসময় তাদের কাছে ধরা দেয়। অলসতা কেবল ব্যর্থতা ডেকে আনে।",
      "শৈশবের দিনগুলো ছিল খুব মধুর। তখন কোনো চিন্তা ছিল না, ছিল শুধু খেলা আর অফুরন্ত আনন্দ। বন্ধুদের সাথে কাটানো সেই সোনালী বিকেলগুলো আজও মনে পড়ে।",
      "কক্সবাজারের সমুদ্র সৈকত পৃথিবীর দীর্ঘতম সমুদ্র সৈকত। এখানকার সূর্যাস্তের দৃশ্য অপূর্ব। বিশাল সমুদ্রের ঢেউ আর গোধূলি বেলার লাল আভা মনকে প্রশান্ত করে তোলে।",
      "ষড়ঋতুর দেশ বাংলাদেশ। গ্রীষ্ম, বর্ষা, শরৎ, হেমন্ত, শীত ও বসন্ত—এই ছয়টি ঋতু চক্রাকারে আসে। প্রতিটি ঋতুরই রয়েছে নিজস্ব রূপ ও সৌন্দর্য যা বাংলাকে বৈচিত্র্যময় করে তুলেছে।",
      "মাটির নিচে এক পিপীলিকার রাজ্য ছিল। তারা সবাই খুব পরিশ্রমী। গ্রীষ্মকালে তারা ভবিষ্যতের জন্য খাদ্য সঞ্চয় করত, যাতে বর্ষাকালে তাদের কোনো কষ্ট না হয়।",
      "ইটের পর ইট গেঁথে শ্রমিকরা একটি বড় দালান তৈরি করছিল। তাদের ঘামে ভেজা শরীর রোদে блеск করছিল। তাদের এই অক্লান্ত পরিশ্রমের ফলেই গড়ে ওঠে সুন্দর শহর।",
      "রাতের আকাশে চাঁদ ও তারার মেলা বসে। চাঁদের স্নিগ্ধ আলোয় চারপাশ আলোকিত হয়। এই দৃশ্য দেখলে মন আপনাআপনি ভালো হয়ে যায় এবং প্রকৃতির প্রতি ভালোবাসা জন্মায়।",
      "একদা এক তৃষ্ণার্ত কাক জলের সন্ধানে ঘুরছিল। অনেক খোঁজার পর সে একটি কলসি দেখতে পেল যার তলায় সামান্য জল ছিল। কাকটি বুদ্ধি করে কলসিতে নুড়ি ফেলে জল উপরে তুলে আনল।",
      "সততা একটি মহৎ গুণ। যে ব্যক্তি সর্বদা সত্য কথা বলে এবং সৎ পথে চলে, সবাই তাকে ভালোবাসে ও সম্মান করে। সততার পুরস্কার জীবনে দেরিতে হলেও পাওয়া যায়।",
      "স্বাস্থ্যই সকল সুখের মূল। শরীরকে সুস্থ রাখার জন্য আমাদের নিয়মিত ব্যায়াম করা এবং পুষ্টিকর খাবার খাওয়া উচিত। একটি সুস্থ শরীর একটি সুন্দর মনের আধার।",
      "আমাদের স্কুলটি খুব সুন্দর। এর সামনে একটি বড় খেলার মাঠ আছে এবং চারপাশে অনেক ফুলের গাছ লাগানো। আমরা আমাদের শিক্ষকদের খুব সম্মান করি এবং মন দিয়ে পড়াশোনা করি।",
      "এক বনে এক সিংহ বাস করত। সে ছিল বনের রাজা। একদিন সে এক ইঁদুরের জালে আটকা পড়ল। ছোট ইঁদুরটি তখন তার ধারালো দাঁত দিয়ে জাল কেটে সিংহকে মুক্ত করল।",
      "ফেরিওয়ালা 'চাই, খেলনা চাই' বলে গ্রামে গ্রামে ঘুরে বেড়াত। তার ঝুড়িতে থাকত নানা রঙের মাটির পুতুল, গাড়ি আর বাঁশি। ছোট ছেলেমেয়েরা তার আসার অপেক্ষায় থাকত।",
      "ঘুড়ি ওড়ানোর উৎসবটি বেশ আনন্দের। নীল আকাশে নানা রঙের ঘুড়ি উড়ে বেড়ায়। একে অপরের ঘুড়ি কাটার প্রতিযোগিতা চলে, যা উৎসবটিকে আরও জমজমাট করে তোলে।",
      "গ্রামের হাটে সপ্তাহে একদিন কেনাবেচার ধুম পড়ে। দূর-দূরান্ত থেকে মানুষ তাদের উৎপাদিত পণ্য নিয়ে আসে। এটি কেবল একটি বাজার নয়, এটি মানুষের মিলনের স্থানও বটে।",
      "ভাষা আন্দোলন ছিল বাংলা ভাষাকে রাষ্ট্রভাষা হিসেবে প্রতিষ্ঠা করার সংগ্রাম। ১৯৫২ সালের ২১শে ফেব্রুয়ারি তারিখে ছাত্ররা ভাষার জন্য নিজেদের জীবন উৎসর্গ করেন।",
      "শৃঙ্খলা জীবনের সকল ক্ষেত্রে অত্যন্ত গুরুত্বপূর্ণ। যে ব্যক্তি তার জীবনে শৃঙ্খলা মেনে চলে, সে সহজেই সাফল্য লাভ করতে পারে। ছাত্রজীবন থেকেই এই অভ্যাস গড়ে তোলা উচিত।"
    ],
    hard: [
      "ঊনবিংশ শতাব্দীর বাংলা নবজাগরণ ছিল মূলত একটি বুদ্ধিবৃত্তিক আন্দোলন, যা সামাজিক কুসংস্কার এবং ধর্মীয় গোঁড়ামির বিরুদ্ধে এক বলিষ্ঠ প্রতিক্রিয়ার জন্ম দিয়েছিল। রাজা রামমোহন রায় এই জাগরণের অগ্রদূত হিসেবে বিবেচিত হন।",
      "বিশ্বায়নের প্রেক্ষাপটে আধুনিক বাংলা সাহিত্যের গতিপ্রকৃতি এক জটিল বহুমাত্রিক রূপ পরিগ্রহ করেছে। একদিকে যেমন আন্তর্জাতিক শিল্পরীতির প্রভাব সুস্পষ্ট, তেমনই অন্যদিকে দেশজ সংস্কৃতির শেকড় অনুসন্ধানের প্রবণতাও লক্ষ্যণীয়।",
      "কোয়ান্টাম পদার্থবিজ্ঞানের অনিশ্চয়তা তত্ত্ব কেবল পারমাণবিক জগতের ক্ষেত্রেই প্রযোজ্য নয়, এটি আমাদের চিরায়ত কার্যকারণ সম্পর্কের ধারণাকেও গভীরভাবে প্রশ্নবিদ্ধ করে। বস্তুর দ্বৈত সত্তা এক গভীর দার্শনিক সংকটের জন্ম দেয়।",
      "সংবিধানের মৌলিক কাঠামো পরিবর্তন করার ক্ষমতা সংসদের আছে কিনা, এই বিতর্কটি বিচার বিভাগীয় পর্যালোচনার অন্যতম গুরুত্বপূর্ণ একটি বিষয়। এটি রাষ্ট্রের তিনটি অঙ্গের মধ্যে ক্ষমতার ভারসাম্য রক্ষার এক চিরন্তন সংগ্রামের প্রতিফলন।",
      "পরিবেশগত সংকট বর্তমানে মানবজাতির অস্তিত্বের জন্য এক চরম হুমকি স্বরূপ। জীবাশ্ম জ্বালানির অনিয়ন্ত্রিত ব্যবহার এবং ব্যাপক অরণ্য নিধন বায়ুমণ্ডলের কার্বন ভারসাম্যকে এমনভাবে বিঘ্নিত করেছে যে এর পরিণতি ভয়াবহ হতে বাধ্য।",
      "শিল্পবিপ্লব পরবর্তী পুঁজিবাদী সমাজব্যবস্থায় শ্রমিকের বিচ্ছিন্নতাবোধ এক অবশ্যম্ভাবী পরিণতি। উৎপাদন প্রক্রিয়া থেকে শ্রমিকের নিয়ন্ত্রণহীনতা এবং তার শ্রমের পণ্যায়ন তাকে নিজের অস্তিত্ব থেকেই পরক করে তোলে।",
      "স্থাপত্যশৈলীর বিবর্তনের দিকে তাকালে দেখা যায় যে, এটি কেবল নান্দনিকতার পরিবর্তন নয়, বরং সমসাময়িক সমাজের প্রযুক্তিগত উৎকর্ষ, অর্থনৈতিক অবস্থা এবং দার্শনিক চিন্তাধারার এক সুস্পষ্ট প্রতিচ্ছবি।",
      "উত্তর-ঔপনিবেশিক রাষ্ট্রসমূহের প্রধান চ্যালেঞ্জ হলো একটি সার্বভৌম জাতীয় পরিচয় নির্মাণ করা। ঔপনিবেশিক প্রভুদের চাপিয়ে দেওয়া বিভাজন এবং সাংস্কৃতিক আধিপত্যের অবশেষ থেকে মুক্তি পাওয়া এক দীর্ঘ এবং যন্ত্রণাদায়ক প্রক্রিয়া।",
      "ভাষার প্রত্নতাত্ত্বিক বিশ্লেষণ আমাদের মানব সভ্যতার বিস্তারের গতিপথ সম্পর্কে অমূল্য তথ্য প্রদান করে। বিভিন্ন ভাষার শব্দভাণ্ডার এবং ব্যাকরণগত কাঠামোর সাদৃশ্য তাদের সাধারণ উৎস এবং ঐতিহাসিক সংযোগের দিকে ইঙ্গিত করে।",
      "স্নায়ুবিজ্ঞানের সাম্প্রতিক গবেষণা প্রমাণ করেছে যে, মানুষের স্মৃতি কোনো স্থির আর্কাইভ নয়, বরং এটি একটি গতিশীল এবং পুনর্গঠনশীল প্রক্রিয়া। প্রতিটি স্মরণ করার মুহূর্তে স্মৃতি সামান্য পরিবর্তিত হয়, যা তার নির্ভরযোগ্যতাকে প্রশ্নবিদ্ধ করে।",
      "বাঙালি জাতীয়তাবাদের উন্মেষ ঘটেছিল মূলত ভাষাভিত্তিক সাংস্কৃতিক পরিচয়ের ভিত্তিতে, যা পরবর্তীতে একটি স্বাধীন রাষ্ট্র প্রতিষ্ঠার রাজনৈতিক সংগ্রামে রূপান্তরিত হয়। এই রূপান্তর প্রক্রিয়ায় ভাষা আন্দোলনের ভূমিকা ছিল অনস্বীকার্য।",
      "পরাবাস্তববাদ প্রচলিত যুক্তির শৃঙ্খল ভেঙে অবচেতন মনের জগতকে উন্মোচন করতে চেয়েছিল। চিত্রকল্প এবং ভাষার অপ্রত্যাশিত সমাবেশের মাধ্যমে তারা চেতনার এক নতুন দিগন্ত অন্বেষণ করার প্রয়াস পেয়েছিল।",
      "অর্থনৈতিক মন্দার চক্রাকার প্রকৃতি سرمایہ دارانہ ব্যবস্থার একটি অন্তর্নিহিত বৈশিষ্ট্য। অতিরিক্ত উৎপাদন, ঋণের প্রসার এবং বাজারের অনুমানভিত্তিক বুদবুদ এই চক্রকে অনিবার্য করে তোলে, যার সামাজিক মূল্য অপরিসীম।",
      "মহাকর্ষীয় তরঙ্গের শনাক্তকরণ আইনস্টাইনের সাধারণ আপেক্ষিকতা তত্ত্বের এক চূড়ান্ত প্রমাণ। এটি মহাবিশ্বের সবচেয়ে ভয়ংকর ঘটনাগুলোকে, যেমন কৃষ্ণগহ্বরের সংঘর্ষ, পর্যবেক্ষণ করার এক নতুন জানালা খুলে দিয়েছে।",
      "ডিজিটাল যুগে তথ্যের অবাধ প্রবাহ একদিকে যেমন গণতন্ত্রায়নের সহায়ক, তেমনই অন্যদিকে এটি উদ্দেশ্যপ্রণোদিত অপতথ্য এবং বিদ্বেষ ছড়ানোর এক শক্তিশালী হাতিয়ার। তথ্যের সত্যতা যাচাই করা আজকের দিনের এক বড় চ্যালেঞ্জ।",
      "একটি গণতান্ত্রিক সমাজে বিচার বিভাগের স্বাধীনতা হলো নাগরিক অধিকার রক্ষার সর্বশেষ এবং সবচেয়ে শক্তিশালী দুর্গ। নির্বাহী এবং আইনসভার প্রভাবমুক্ত হয়ে কাজ করার ক্ষমতা না থাকলে আইনের শাসন ভেঙে পড়তে বাধ্য।",
      "নৃতাত্ত্বিক গবেষণায় অংশগ্রহণমূলক পর্যবেক্ষণ পদ্ধতি গবেষককে সংস্কৃতির অভ্যন্তরীণ দৃষ্টিকোণ থেকে বোঝার সুযোগ করে দেয়। এটি শুষ্ক তথ্যের পরিবর্তে একটি জনগোষ্ঠীর জীবন্ত বাস্তবতাকে তুলে ধরে।",
      "জেনেটিক ইঞ্জিনিয়ারিং বা বংশগতি প্রকৌশল মানবজাতির জন্য অফুরন্ত সম্ভাবনা এবং গভীর নৈতিক উভয়সংকট তৈরি করেছে। প্রকৃতিতে হস্তক্ষেপ করার এই ক্ষমতা আমাদের দায়িত্ববোধের এক চরম পরীক্ষা নিতে চলেছে।",
      "চর্যাপদকে বাংলা ভাষার প্রাচীনতম নিদর্শন হিসেবে গণ্য করা হয়। এর সহজিয়া বৌদ্ধ সাধকদের गूढ़ার্থমূলক কবিতাগুলো তৎকালীন বাংলার সামাজিক এবং ধর্মীয় জীবনের এক অস্পষ্ট কিন্তু মূল্যবান চিত্র তুলে ধরে।",
      "ধ্রুপদী সঙ্গীতের রাগ কাঠামো কেবল কয়েকটি স্বরের সমষ্টি নয়, এটি একটি নির্দিষ্ট আবেগ বা রসকে প্রকাশ করার এক শৈল্পিক বিন্যাস। প্রতিটি রাগের পরিবেশনের সময় এবং মেজাজ নির্দিষ্ট, যা এর আবেদনকে গভীরতর করে।",
      "রাজনৈতিক দর্শনে সার্বভৌমত্বের ধারণা সময়ের সাথে সাথে পরিবর্তিত হয়েছে। একসময় যা রাজার ঐশ্বরিক অধিকার হিসেবে বিবেচিত হতো, আজ তা জনগণের সম্মিলিত ইচ্ছার প্রকাশ হিসেবে সংজ্ঞায়িত হয়।",
      "বিমূর্ত চিত্রকলা বস্তুর বাহ্যিক রূপকে অতিক্রম করে রঙ, রেখা এবং আকারের মাধ্যমে আবেগ ও অনুভূতিকে প্রকাশ করার চেষ্টা করে। এটি দর্শকের কল্পনাশক্তিকে সক্রিয় করে তোলে এবং ব্যাখ্যার স্বাধীনতা প্রদান প্রদান করে।",
      "প্রতিকূল পরিবেশে টিকে থাকার জন্য জীবজগতের অভিযোজন প্রক্রিয়া এক বিস্ময়কর উদাহরণ। প্রাকৃতিক নির্বাচনের মাধ্যমে মিলিয়ন মিলিয়ন বছর ধরে যে সূক্ষ্ম পরিবর্তনগুলো ঘটে, তা জীবনের অদম্য শক্তির পরিচয় দেয়।",
      "একটি দেশের মুদ্রানীতি তার অর্থনৈতিক স্থিতিশীলতার জন্য অত্যন্ত গুরুত্বপূর্ণ। মুদ্রাস্ফীতি নিয়ন্ত্রণ, বিনিময় হার স্থিতিশীল রাখা এবং বিনিয়োগের জন্য অনুকূল পরিবেশ তৈরি করা কেন্দ্রীয় ব্যাংকের অন্যতম প্রধান দায়িত্ব।",
      "অস্তিত্ববাদ ঘোষণা করে যে মানুষের অস্তিত্ব তার সারধর্মের পূর্বগামী। অর্থাৎ, আমরা প্রথমে জগতে নিক্ষিপ্ত হই এবং তারপরে আমাদের পছন্দ ও কর্মের মাধ্যমে আমরা নিজেদেরকে তৈরি করি। কোনো পূর্বনির্ধারিত মানব প্রকৃতি নেই।",
      "ঐতিহাসিক বস্তুবাদ অনুসারে, সমাজের উৎপাদন ব্যবস্থা এবং শ্রেণি সম্পর্কই তার আইন, রাজনীতি এবং সংস্কৃতির ভিত্তি নির্ধারণ করে। ইতিহাসের চালিকাশক্তি হলো শ্রেণি সংগ্রাম।",
      "মহাকাশ গবেষণায় কৃষ্ণগহ্বর বা ব্ল্যাক হোল হলো এমন একটি বস্তু যার মহাকর্ষীয় টান এতটাই শক্তিশালী যে আলো পর্যন্ত তা থেকে বের হতে পারে না। এটি স্থান-কালের বুননকে চূড়ান্ত পর্যায়ে বাঁকিয়ে দেয়।",
      "প্রত্নতাত্ত্বিক খননকার্যের মাধ্যমে বিলুপ্ত সভ্যতার যে ধ্বংসাবশেষ উন্মোচিত হয়, তা আমাদের অতীতের জীবনযাত্রা, বিশ্বাস এবং সামাজিক কাঠামো সম্পর্কে মূল্যবান অন্তর্দৃষ্টি প্রদান করে। প্রতিটি মৃৎপাত্রের টুকরো এক একটি না বলা গল্পের সাক্ষী।",
      "একটি সফল অনুবাদ কেবল শব্দের প্রতিশব্দ স্থাপন নয়, বরং এক সংস্কৃতি থেকে অন্য সংস্কৃতিতে ভাব, অনুভূতি এবং নান্দনিকতার স্থানান্তর। অনুবাদককে উভয় ভাষার আত্মাকে ধারণ করতে হয়।",
      "গণমাধ্যমের এজেন্ডা-সেটিং তত্ত্ব অনুযায়ী, সংবাদমাধ্যম কোন খবরকে কতটা গুরুত্ব দেবে, তা নির্ধারণ করার মাধ্যমে জনগণের আলোচনার বিষয়বস্তু এবং চিন্তার জগতকে প্রভাবিত করতে পারে। তারা হয়তো আমাদের বলে না কীভাবে ভাবতে হবে, কিন্তু তারা বলে কী নিয়ে ভাবতে হবে।"
    ]
  }
};

type Language = 'english' | 'bengali';
type Difficulty = 'easy' | 'medium' | 'hard';

export function generateTypingText(language: string, difficulty: string): string {
    const lang = language as Language;
    const diff = difficulty as Difficulty;

    const passages = texts[lang]?.[diff];

    if (!passages || passages.length === 0) {
        // Fallback text in case of an invalid language or difficulty
        return "The quick brown fox jumps over the lazy dog. This is a default sentence if the requested text is not found.";
    }

    const randomIndex = Math.floor(Math.random() * passages.length);
    return passages[randomIndex];
}