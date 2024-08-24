export default function Page({ params }: { params: { id: string } }) {
	return (
		<div className="flex justify-center items-center h-screen gap-2 flex-col">
			<h1>Server: {params.id}</h1>
		</div>
	);
}
