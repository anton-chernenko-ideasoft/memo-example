import {
  Profiler,
  ProfilerOnRenderCallback,
  PropsWithChildren,
  memo,
  useState,
  useTransition,
} from "react";

const onRenderCallback: ProfilerOnRenderCallback = (
  id,
  phase,
  actualDuration
) => {
  console.log(`Profiler [${id}] - ${phase} - ${actualDuration} ms`);
};

const Child = ({ item }: { item: string }) => {
  return <div>{item}</div>;
};

const MemoizedChild = memo(Child);

const BIG_ARRAY = Array.from(
  { length: 50000 },
  (_, index) => `item ${(index + 1).toString().padStart(5, "0")}`
);

const Button = ({
  children,
  onClick,
}: PropsWithChildren<{ onClick: () => void }>) => {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      onClick={() => {
        startTransition(() => {
          if (!isPending) onClick();
        });
      }}
    >
      {children} {isPending && "Is pending"}
    </button>
  );
};

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Button onClick={() => setCount((count) => count + 1)}>
        Count: {count}
      </Button>
      <Profiler id="non_memoized_dynamic" onRender={onRenderCallback}>
        <div style={{ background: "wheat" }}>
          {BIG_ARRAY.map((item) => (
            <Child key={item} item={`${count}`} />
          ))}
        </div>
      </Profiler>
      {/* bad usage of memo */}
      <Profiler id="memoized_dynamic" onRender={onRenderCallback}>
        <div style={{ background: "aqua" }}>
          {BIG_ARRAY.map((item) => (
            <MemoizedChild key={item} item={`${count}`} />
          ))}
        </div>
      </Profiler>

      <Profiler id="non_memoized_static" onRender={onRenderCallback}>
        <div style={{ background: "wheat" }}>
          {BIG_ARRAY.map((item) => (
            <Child key={item} item={item} />
          ))}
        </div>
      </Profiler>
      {/* good usage of memo */}
      <Profiler id="memoized_static" onRender={onRenderCallback}>
        <div style={{ background: "aqua" }}>
          {BIG_ARRAY.map((item) => (
            <MemoizedChild key={item} item={item} />
          ))}
        </div>
      </Profiler>
    </>
  );
}

export default App;
