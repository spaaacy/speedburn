const guidelines = [
  "Rule 1",
  "Rule 2",
  "Role 3",
  "Rule 4",
  "Rule 5",
  "Rule 6",
  "Rule 7",
  "Rule 8",
  "Rule 9",
  "Rule 10",
];

const Guidelines = () => {
  return (
    <main className="max-width w-full flex flex-col justify-start items-start">
      <h1 className="text-3xl font-bold">Sites Guidelines</h1>
      <ul className="ml-10 mt-5">
        {guidelines.map((rule, i) => {
          return (
            <li key={i}>
              <p>{`${i+1}: ${rule}`}</p>
            </li>
          );
        })}
      </ul>
    </main>
  );
};

export default Guidelines;
