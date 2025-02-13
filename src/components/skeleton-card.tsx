import { Skeleton } from "./ui/skeleton";

export default function SkeletonCard() {
    return (
        <div className="flex flex-col space-y-3">
            <div className="space-y-2">
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-4 w-[250px]" />
            </div>
            <Skeleton className="h-[300px] lg:h-[500px] rounded-xl" />
        </div>
    )
}