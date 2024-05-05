"use client";
import { useParams } from "next/navigation";

const Page = () => {
  const param = useParams();
  const id = param.id;
  return <div>detailed view: {id}</div>;
};

export default Page;
