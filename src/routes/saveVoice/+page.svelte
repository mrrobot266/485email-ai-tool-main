<script lang="ts">
    import { initializeApp } from 'firebase/app';
    import { getFirestore, setDoc, getDocs, collection, Firestore } from 'firebase/firestore';
    import { docStore } from "sveltefire";
    import { getAnalytics } from "firebase/analytics";
    import { onMount } from 'svelte';

    const firebaseConfig = {
        apiKey: "AIzaSyAFxmdgTabKYliNNrZVj0s2XCFZPfwTyps",
        authDomain: "touchpoint-capstone-database.firebaseapp.com",
        projectId: "touchpoint-capstone-database",
        storageBucket: "touchpoint-capstone-database.appspot.com",
        messagingSenderId: "1032080279652",
        appId: "1:1032080279652:web:9a53f2acb5069e91513771",
        measurementId: "G-HH2QG68FLN"
    };

    const app = initializeApp(firebaseConfig);
    const db = getFirestore();
    const analytics = getAnalytics(app);

async function getPersonas(db: Firestore) {
  const writingStylesCollection  = collection(db, 'writingStyles');
  const querySnapshot  = await getDocs(writingStylesCollection);
  const writingStylesData  = querySnapshot .docs.map(doc => doc.data());
  return writingStylesData ;
}


let writingStyles: any[] = [];

onMount(async () => {
        writingStyles = await getPersonas(db);
    });

</script>



	<div class="max-w-md w-full m-auto">

        <div class="text-3xl font-semibold mt-8">Save New Voice Style</div>
        <div class="text-sm text-dull my-6">Train Touchpoint A.I to match your unique voice and persona. Tailor its communication style to reflect your identity and make it speak in a manner that mirrors your distinctive tone and character.</div>

		<h2 class="font-semibold">Saved Personas:</h2>
        <br/>
		<ul>
            {#each writingStyles as style}
                <li>{style.personaName}</li>
            {/each}
        </ul>
        <br/>
        <a href="/saveVoice/newPersona">
            <button class="bg-secondary w-full p-4 rounded-md my-2">Create new persona style</button>
        </a>
	</div>







<style>
    /* Set width to 100% and use flex display for horizontal alignment */
    .saveVoice {
        width: 100%;
        text-align: center;
        display: block;
        margin-bottom: 100px;
        justify-content: space-around; /* To evenly space the tab links */
    }
</style>
