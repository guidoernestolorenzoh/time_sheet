/* import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";

export default function LoginPage() {
  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-lg text-center justify-center">
          <h1 className={title()}>Login</h1>
        </div>
      </section>
    </DefaultLayout>
  );
}
 */

import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Link,
  Form,
  Input,
  Button,
} from "@heroui/react";
import { useState } from "react";

import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";

import Logo from "../assets/kurita.svg";

export default function LoginPage() {
  const [action, setAction] = useState(null);

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4">
        <Card className="max-w-[400px] border">
          <CardHeader className="flex gap-3">
            <Form
              className="w-full p-5 flex flex-col justify-center items-center gap-8"
              onReset={() => setAction("reset")}
              onSubmit={(e) => {
                e.preventDefault();
                let data = Object.fromEntries(new FormData(e.currentTarget));

                setAction(`submit ${JSON.stringify(data)}`);
              }}
            >
              <div className="inline-block space-y-5 max-w-lg text-center justify-center">
                <img 
                  src={Logo} 
                  height="100"
                  width="100" 
                  alt="Logo" 
                  className="mx-auto"
                />
                <h1 className={title()}>Login</h1>
                <p className="font-thin">
                  Enter your email below to login to your account
                </p>
              </div>
              <Input
                isRequired
                variant="bordered"
                errorMessage="Please enter a valid username"
                label="Username"
                labelPlacement="outside"
                name="username"
                placeholder="Enter your username"
                className="font-bold mx-5"
                type="text"
              />

              <Input
                isRequired
                errorMessage="Invalid password or username"
                label="Password"
                variant="bordered"
                labelPlacement="outside"
                name="password"
                placeholder="Enter your password"
                type="password"
                className="font-bold w-full"
              />              
              <Button 
                color="primary" 
                type="submit"
                className="w-full font-semibold"
              >
                Login
              </Button>
              
            </Form>
          </CardHeader>
        </Card>
      </section>
    </DefaultLayout>
  );
}