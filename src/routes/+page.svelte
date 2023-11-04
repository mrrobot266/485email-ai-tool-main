<script>
  import Fa from 'svelte-fa'
  import { faHeadset, faAd, faComments, faCircleNodes, faPeopleGroup, faRocket, faCalendarCheck, faVolumeHigh, faUsersRays } from '@fortawesome/free-solid-svg-icons'

	const whatWeDos = [
	  {
		title: "Sales Outreach",
		desc: "Draft engaging emails that grab your leads' attention and spark interest.",
		icon: faUsersRays
	  },
	  {
		title: "Customer Support",
		desc: "Craft responsive emails ensuring clients feel heard and valued every step of the way.",
		icon: faHeadset
	  },
	  {
		title: "Marketing Campaigns",
		desc: "Create captivating email campaigns that resonate with your audience and drive conversions.",
		icon: faAd
	  },
	  {
		title: "Internal Communication",
		desc: "Design internal emails that keep teams informed, aligned, and motivated.",
		icon: faComments
	  },
	  {
		title: "Networking",
		desc: "Construct meaningful emails that foster connections and open doors to new opportunities.",
		icon: faCircleNodes
	  },
	  {
		title: "Recruitment",
		desc: "Generate compelling emails that attract top talent and build strong teams.",
		icon: faPeopleGroup
	  },
	  {
		title: "Product Launches",
		desc: "Design announcement emails that build anticipation and excitement around your new products.",
		icon: faRocket
	  },
	  {
		title: "Event Promotions",
		desc: "Create buzzworthy emails that drive attendance and engagement for your events.",
		icon: faCalendarCheck
	  },
	  {
		title: "DRIP Campaigns",
		desc: "Sequence insightful emails that nurture leads, guiding them from interest to conversion seamlessly.",
		icon: faVolumeHigh
	  }
	]
  
  </script>
  
	
  
  <div class="section flex p-16 pb-24 items-center px-72">
	<div class="w-1/2">
	  <div class="text-5xl">
		Automate your Emails with the Power of AI
		<div class="text-dull mt-4 text-sm">
			Supercharge Your Email Workflow with AI Automation! Harness the power of artificial intelligence to streamline and optimize your email communication. 
			Say goodbye to repetitive tasks and hello to smarter, more efficient email management.		</div>
	  </div>
	  <a href="/email-writing">
		<button class="bg-secondary w-96 p-4 rounded-md my-8">
		  Start Now
		</button>
	  </a>
	</div>
	<div class="text-right w-1/2">
		<img src="automation.png" alt="automation"/>
	</div>
  </div>
  
  <div class="section globe-bg relative">
	<div class="absolute left-0 right-0 top-0 bottom-0 overlay py-16">
		<div class="text-6xl text-center">
		What We Do
		</div>
		<div class="grid grid-cols-3 px-72 gap-20 mt-20">
		{#each whatWeDos as item}
			<div class="flex items-start cursor-pointer hover:bg-highlight p-4 rounded-lg">
				<span class="pr-8 pt-2">
					<Fa icon={item.icon} size="lg" />
				</span>
				<div>
					<div class="text-2xl">{ item.title }</div>
					<div class="text-dull mt-4 text-sm">
						{ item.desc }
					</div>
				</div>
			</div>
		{/each}
		</div>
	</div>
  </div> 
  <div class="p-16 pb-24 items-center px-72 flex flex-col justify-center items-center">
	<div class="text-4xl text-center">
		Want to see what else we offer? 🌟
	</div>
	<div class="mt-10">
		<a href="https://touchpointdigitalmarketing.com/" target="_blank">
			<button class="bg-secondary w-96 p-4 rounded-md my-8">
				Visit Main Website
			</button>
		</a>
	</div>
  </div>
  
  <style>
	.globe-bg {
		background: url('bg2.jpeg');
		background-position: center;
		background-repeat: no-repeat;
		background-size: cover;
	}
	.overlay {
		background-color:rgba(0, 0, 0, 0.6);
	}
  </style>
  
