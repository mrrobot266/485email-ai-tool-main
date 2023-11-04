<script lang="ts">
    import { initializeApp } from 'firebase/app';
    import { getFirestore, setDoc, getDocs, collection, Firestore } from 'firebase/firestore';
    import { getAnalytics } from "firebase/analytics";
    import { onMount } from 'svelte';
    import { BarLoader } from 'svelte-loading-spinners';
    import Fa from 'svelte-fa'
    import { faEdit } from '@fortawesome/free-solid-svg-icons'

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

let loading = false

async function getPersonas(db: Firestore) {
    loading = true
    const writingStylesCollection  = collection(db, 'writingStyles');
    const querySnapshot  = await getDocs(writingStylesCollection);
    const writingStylesData  = querySnapshot.docs.map(doc =>({
        ref: doc.id,
        ...doc.data()
    }))
    loading = false
    return writingStylesData.reverse() ;
}


let writingStyles: any[] = [];

onMount(async () => {
    writingStyles = await getPersonas(db);
});

</script>
    <div class="section p-16 px-72">

        <div class="flex justify-between items-center p-2">
            <div class="flex-1">
                <div class="text-3xl font-semibold mt-8" >Save New Voice Style</div>
                <div class="text-sm text-dull my-2 pr-72">Train Touchpoint A.I to match your unique voice and persona. Tailor its communication style to reflect your identity and make it speak in a manner that mirrors your distinctive tone and character.</div>
            </div>
            <a href="/save-voice/newPersona">
                <button class="bg-secondary p-2 rounded-md w-64">
                    + Create New
                </button>
            </a>
        </div>
        
		<div>
            {#each writingStyles as style}
            <a href={`/save-voice/newPersona?id=${style.ref}`}>
                <div class="flex justify-between p-8 border-dull border m-2 rounded-md cursor-pointer transition duration-500 hover:bg-dull">
                    {style.personaName}
                    <button>
                        <Fa icon={faEdit} size="lg" /> 
                    </button>
                </div>
            </a>
            {/each}
        </div>
        {#if loading}
            <div class="flex justify-center mt-8">
                <BarLoader color="#929191" />
            </div>
        {/if}
       
	</div>



