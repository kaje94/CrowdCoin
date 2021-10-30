import React, { useState } from "react";
import Layout from "../../../../components/Layout";
import { Button } from "semantic-ui-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Breadcrumb, Table } from "semantic-ui-react";
import Campaign from "../../../../ethereum/campaign";
import { useQuery, dehydrate, QueryClient } from "react-query";
import { getDeployedCampaigns } from "../../../index";
import RequestRow from "../../../../components/RequestRow";

const getRequestsCount = async (campaignAddress) => {
  const campaign = Campaign(campaignAddress);
  return campaign.methods.getRequestsCount().call();
};
const requestCountKey = "request-count";

const getApproversCount = async (campaignAddress) => {
  const campaign = Campaign(campaignAddress);
  return campaign.methods.approversCount().call();
};
const approversCountKey = "approvers-count";

const getRequestList = async (campaignAddress, requestCount) => {
  const campaign = Campaign(campaignAddress);
  return Promise.all(
    Array(parseInt(requestCount))
      .fill()
      .map((_element, index) => campaign.methods.requests(index).call())
  );
};
const requestListKey = "request-list";

const RequestPage = () => {
  const router = useRouter();
  const address = router.query.address;
  const [page, setPage] = useState(0);

  const { data: requestCount = 0 } = useQuery([requestCountKey, address], () =>
    getRequestsCount(address)
  );

  const { data: approversCount = 0 } = useQuery(
    [approversCountKey, address],
    () => getApproversCount(address)
  );

  const { data: requests = [], refetch: refetchRequests } = useQuery(
    [requestListKey, address, page, requestCount],
    () => getRequestList(address, requestCount),
    {
      enabled: !!requestCount,
    }
  );

  const { Header, Row, HeaderCell, Body } = Table;

  return (
    <Layout>
      <Breadcrumb>
        <Breadcrumb.Section href="/">Campaigns</Breadcrumb.Section>
        <Breadcrumb.Divider />
        <Breadcrumb.Section href={`/campaigns/${address}`}>
          Details
        </Breadcrumb.Section>
        <Breadcrumb.Divider />
        <Breadcrumb.Section active>Requests</Breadcrumb.Section>
      </Breadcrumb>
      <h3>Requests</h3>
      <Link href={`/campaigns/${address}/requests/new`}>
        <a>
          <Button primary floated="right" style={{ marginBottom: 10 }}>
            Add Request
          </Button>
        </a>
      </Link>
      <Table>
        <Header>
          <Row>
            <HeaderCell>ID</HeaderCell>
            <HeaderCell>Description</HeaderCell>
            <HeaderCell>Amount</HeaderCell>
            <HeaderCell>Recipient</HeaderCell>
            <HeaderCell>Approval Count</HeaderCell>
            <HeaderCell>Approve</HeaderCell>
            <HeaderCell>Finalize</HeaderCell>
          </Row>
        </Header>
        <Body>
          {requests.map((request, index) => (
            <RequestRow
              key={index}
              id={index}
              request={request}
              campaignAddress={address}
              approversCount={approversCount}
              refetchRequests={refetchRequests}
            />
          ))}
        </Body>
      </Table>
      <div>{`Found ${requestCount} requests`}</div>
    </Layout>
  );
};

export const getStaticPaths = async () => {
  const allCampaigns = await getDeployedCampaigns();
  const paths = allCampaigns.map((address) => ({ params: { address } }));
  return { paths, fallback: "blocking" };
};

export const getStaticProps = async ({ params }) => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery([requestCountKey, params?.address], () =>
    getRequestsCount(params?.address)
  );
  await queryClient.prefetchQuery([approversCountKey, params?.address], () =>
    getApproversCount(params?.address)
  );
  return { props: { dehydratedState: dehydrate(queryClient) } };
};

export default RequestPage;
