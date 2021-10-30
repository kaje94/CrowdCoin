import React, { useState, useCallback } from "react";
import Layout from "../../components/Layout";
import { Form, Button, Input, Message, Breadcrumb } from "semantic-ui-react";
import factory from "../../ethereum/factory";
import web3 from "../../ethereum/web3";
import { useMutation } from "react-query";
import { useRouter } from "next/router";

const CampaignNew = () => {
  const [minContribution, setMinContribution] = useState("");
  const router = useRouter();

  const { mutate, isLoading, error, isError } = useMutation(
    async (value) => {
      router.prefetch("/");
      const accounts = await web3.eth.getAccounts();
      await factory.methods.createCampaign(value).send({ from: accounts[0] });
    },
    {
      onSuccess: () => router.push("/"),
    }
  );

  const onSubmit = useCallback(
    (event) => {
      event.preventDefault();
      mutate(minContribution);
    },
    [minContribution]
  );

  return (
    <Layout>
      <Breadcrumb>
        <Breadcrumb.Section href="/">Campaigns</Breadcrumb.Section>
        <Breadcrumb.Divider />
        <Breadcrumb.Section active>New</Breadcrumb.Section>
      </Breadcrumb>
      <h3>Create a Campaign</h3>
      <Form onSubmit={onSubmit} error={isError}>
        <Form.Field>
          <label>Minimum contribution</label>
          <Input
            value={minContribution}
            onChange={({ target: { value } }) => setMinContribution(value)}
            label="wei"
            labelPosition="right"
            disabled={isLoading}
          />
        </Form.Field>
        <Message error header="Oops!" content={error?.message} />
        <Button loading={isLoading} primary>
          Create
        </Button>
      </Form>
    </Layout>
  );
};

export default CampaignNew;
