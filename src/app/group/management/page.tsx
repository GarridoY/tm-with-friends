"use client";

import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

function getGroup(): { name: string, members: string[] } | null {
	const group = localStorage.getItem("group");
	return group ? JSON.parse(group) : null;
}

function saveGroup(group: { name: string, members: string[] }) {
	localStorage.setItem("group", JSON.stringify(group));
}

export default function GroupManagement() {
	const [group, setGroup] = useState<{ name: string, members: string[] }>(getGroup() || { name: "My Group", members: [""] });
	
	function addPlayer() {
		setGroup({...group, members: [...group.members, ""]});
	}
	function removePlayer(index: number) {
		setGroup({...group, members: group.members.filter((_, i) => i !== index)});
	}
	const handleNameChange = (index: number, newName: string) => {
        setGroup({
            ...group,
            members: group.members.map((member, i) => i === index ? newName : member)
        });
    }
	return (
		<>
			<Header 
				header="Group management" 
				label="Here you can manage your group, add new members, and more." 
			/>

			<div className="lg:w-1/3 flex flex-col">
				<Label htmlFor="group-name">Group name</Label>
				<Input name="group-name" className="mt-4 mb-8" placeholder="Group name" value={group.name} onChange={(e) => setGroup({...group, name: e.target.value})} />

				{group.members.map((member, index) => (
					<div key={index} className="flex flex-col mb-4">
						<Label htmlFor={'member'+index} className="pb-2">Player {index + 1}</Label>
						<div className="flex items-center gap-2">
							<Input type="text" name={'member'+index} placeholder="Display name" value={member} onChange={(e) => handleNameChange(index, e.target.value)} />
							
							<Button type="button" className="w-fit" onClick={() => removePlayer(index)}>Remove player</Button>
						</div>
					</div>
				))}

				<Button type="button" className="w-fit" onClick={addPlayer}>+ Add player</Button>

				<Button type="button" className="w-full mt-4" onClick={() => saveGroup(group)}>Save group</Button>
			</div>
		</>
	);
}