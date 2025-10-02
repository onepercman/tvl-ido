import { toaster } from "@/libs/toaster"
import { userService } from "@/services"
import {
  Button,
  Container,
  Dialog,
  Empty,
  Field,
  Loader,
  Pagination,
  Spinner,
  Table,
} from "@/shared/components"
import { Icon, IconSax } from "@/shared/icons"
import { DEFAULT_DATE_FORMAT } from "@/shared/utils/date"
import { formatNumber } from "@/shared/utils/number"
import { formatAddress, getBlockUrl } from "@/shared/utils/web3"
import { useAppKitAccount } from "@reown/appkit/react"
import dayjs from "dayjs"
import { FC, useState } from "react"
import { Link } from "react-router-dom"
import { useStore } from "use-valtio-store"
import { useChainId } from "wagmi"
import UserStore from "../user/user.store"
import { useCommissionHistory } from "./use-commission-history"
import { useDirectDownline } from "./use-direct-downlines"
import { useReferralPerformance } from "./use-referral-performance"

export default function Dashboard() {
  const { address } = useAppKitAccount()

  const { user, isLeader } = useStore(UserStore)

  if (!address || !user) return

  return (
    <Container className="space-y-[100px] pt-[100px]">
      <div className="rounded-md bg-component bg-[url(/material/cubes-bg.png)] bg-cover bg-center bg-no-repeat p-[52px] text-center">
        {user.ref_code ? (
          <div className="m-auto flex flex-col items-center">
            <div className="inline-flex items-center gap-3">
              <span className="text-2xl font-semibold">
                {formatAddress(address)}
              </span>
              <button
                type="button"
                onClick={function () {
                  navigator.clipboard.writeText(address)
                  toaster.success({
                    title: "Copied address successfully",
                  })
                }}
              >
                <IconSax.Copy size={24} variant="Bold" />
              </button>
            </div>
            <div className="mt-3 text-secondary">
              Your Referral Code {user.ref_code}
            </div>
            <Button
              size="lg"
              color="primary"
              className="mt-10"
              rightIcon={<IconSax.Link />}
              onClick={function () {
                const url = new URL(window.location.origin)
                url.searchParams.set("ref", user.ref_code)
                navigator.clipboard.writeText(url.toString())
                toaster.success({ title: "Copied url successfully" })
              }}
            >
              Share Link
            </Button>
          </div>
        ) : (
          <div className="m-auto flex flex-col items-center">
            <div className="inline-flex items-center gap-3">
              <span className="text-2xl font-semibold">
                Activate Your Referral Code
              </span>
            </div>
            <div className="mt-3 text-secondary">
              Buy 1 Package to activate your code and start earning commissions.
            </div>
            <Button
              as={Link}
              to="/"
              size="lg"
              color="primary"
              className="mt-10"
              rightIcon={<IconSax.ArrowRight />}
            >
              Buy Now
            </Button>
          </div>
        )}
      </div>

      <ReferralPerformance />

      <DirectDownline />

      <CommissionHistory />

      {isLeader ? <LeaderPerformance /> : null}

      <Withdraw />

      <div className="flex w-full flex-col items-stretch justify-center gap-6 sm:flex-row sm:items-center">
        <Button
          as={Link}
          to="/withdrawal-history"
          size="lg"
          color="primary"
          rightIcon={<IconSax.ClipboardImport variant="Bold" />}
        >
          View Withdrawal History
        </Button>
        <Button
          as={Link}
          to="/order-history"
          size="lg"
          color="primary"
          rightIcon={<IconSax.ShoppingCart variant="Bold" />}
        >
          View Purchase Orders
        </Button>
      </div>
    </Container>
  )
}

const ReferralPerformance: FC = () => {
  const { data, isLoading } = useReferralPerformance()

  return (
    <div className="space-y-[52px]">
      <div className="text-2xl font-semibold">Referral Performance</div>
      <div className="grid grid-cols-1 gap-[52px] lg:grid-cols-3">
        <div className="inline-flex justify-between gap-6 rounded-md border border-line-2 bg-component p-10">
          <div className="flex flex-col gap-5">
            <div className="inline-flex items-center gap-3">
              <IconSax.Profile2User size={24} variant="Bold" />
              <span className="whitespace-nowrap text-lg font-semibold">
                Total Referrals
              </span>
            </div>
            {isLoading ? (
              <Spinner />
            ) : (
              <div className="text-[32px] font-bold">
                {formatNumber(data?.total_referral ?? 0)}
              </div>
            )}
          </div>
          <img
            src="/dashboard/profile-2user.png"
            alt=""
            width={120}
            height={120}
          />
        </div>
        <div className="inline-flex justify-between gap-6 rounded-md border border-line-2 bg-component p-10">
          <div className="flex flex-col gap-5">
            <div className="inline-flex items-center gap-3">
              <IconSax.Chart size={24} variant="Bold" />
              <span className="whitespace-nowrap text-lg font-semibold">
                Downline Volume
              </span>
            </div>
            {isLoading ? (
              <Spinner />
            ) : (
              <div className="text-[32px] font-bold">
                {formatNumber(data?.downline_volume ?? 0)} USDT
              </div>
            )}
          </div>
          <img src="/dashboard/chart.png" alt="" width={120} height={120} />
        </div>
        <div className="inline-flex justify-between gap-6 rounded-md border border-line-2 bg-component p-10">
          <div className="flex flex-col gap-5">
            <div className="inline-flex items-center gap-3">
              <Icon.Pig fontSize={24} />
              <span className="whitespace-nowrap text-lg font-semibold">
                Total Rewards
              </span>
            </div>
            {isLoading ? (
              <Spinner />
            ) : (
              <div className="text-[32px] font-bold">
                {formatNumber(data?.total_reward ?? 0)} USDT
              </div>
            )}
          </div>
          <img src="/dashboard/pig.png" alt="" width={120} height={120} />
        </div>
      </div>
    </div>
  )
}

const DirectDownline: FC = () => {
  const { data, isLoading, page, setPage } = useDirectDownline()
  const chainId = useChainId()

  return (
    <div className="space-y-[52px]">
      <div className="text-2xl font-semibold">Direct Downlines (F1)</div>
      <Table>
        <Table.Header>
          <Table.Column align="left">Wallet Address</Table.Column>
          <Table.Column align="left">Joined Date</Table.Column>
          <Table.Column align="left">Total Spent (USDT)</Table.Column>
        </Table.Header>
        <Table.Body>
          {isLoading ? (
            <Table.Row>
              <Table.Cell colSpan={3}>
                <Loader />
              </Table.Cell>
            </Table.Row>
          ) : !data?.list.length ? (
            <Table.Row>
              <Table.Cell colSpan={3}>
                <Empty>No direct downlines yet</Empty>
              </Table.Cell>
            </Table.Row>
          ) : (
            data.list.map((item, index) => (
              <Table.Row key={index}>
                <Table.Cell align="left">
                  <a
                    href={getBlockUrl(item.wallet, chainId, "address")}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {formatAddress(item.wallet)}
                  </a>
                </Table.Cell>
                <Table.Cell align="left">
                  {dayjs(item.create_at).format(DEFAULT_DATE_FORMAT)}
                </Table.Cell>
                <Table.Cell align="left">
                  {formatNumber(item.total_spend)}
                </Table.Cell>
              </Table.Row>
            ))
          )}
        </Table.Body>
      </Table>
      <div className="inline-flex w-full justify-center">
        <Pagination
          count={data?.total}
          pageSize={10}
          page={page}
          onPageChange={({ page }) => setPage(page)}
        />
      </div>
    </div>
  )
}

const CommissionHistory: FC = () => {
  const { data, isLoading, page, setPage } = useCommissionHistory()

  return (
    <div className="space-y-[52px]">
      <div className="text-2xl font-semibold">Commission History</div>
      <Table>
        <Table.Header>
          <Table.Column align="left">TX Hash</Table.Column>
          <Table.Column align="left">Date</Table.Column>
          <Table.Column align="left">Level</Table.Column>
          <Table.Column align="left">Amount Earned (USDT)</Table.Column>
        </Table.Header>
        <Table.Body>
          {isLoading ? (
            <Table.Row>
              <Table.Cell colSpan={4}>
                <Loader />
              </Table.Cell>
            </Table.Row>
          ) : !data?.list.length ? (
            <Table.Row>
              <Table.Cell colSpan={4}>
                <Empty>No commission history yet</Empty>
              </Table.Cell>
            </Table.Row>
          ) : (
            data.list.map((commission, index) => (
              <Table.Row key={index}>
                <Table.Cell align="left">
                  <a
                    href={getBlockUrl(commission.tx_id, commission.chain_id)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {formatAddress(commission.tx_id)}
                  </a>
                </Table.Cell>
                <Table.Cell align="left">
                  {dayjs(commission.date).format(DEFAULT_DATE_FORMAT)}
                </Table.Cell>
                <Table.Cell align="left">F{commission.level}</Table.Cell>
                <Table.Cell align="left">
                  {commission.amount_earned} USDT
                </Table.Cell>
              </Table.Row>
            ))
          )}
        </Table.Body>
      </Table>
      <div className="inline-flex w-full justify-center">
        <Pagination
          count={data?.total}
          pageSize={10}
          page={page}
          onPageChange={({ page }) => setPage(page)}
        />
      </div>
    </div>
  )
}

const LeaderPerformance: FC = () => {
  const { data, isLoading } = useReferralPerformance()

  return (
    <div className="space-y-[52px]">
      <div className="text-2xl font-semibold">Leader Performance</div>
      <div className="grid grid-cols-1 gap-[52px] lg:grid-cols-3">
        <div className="inline-flex justify-between gap-6 rounded-md border border-line-2 bg-component bg-[url(/dashboard/dots-bg.png)] bg-cover bg-right-top bg-no-repeat p-10">
          <div className="flex flex-col gap-5">
            <div className="inline-flex items-center gap-3">
              <span className="whitespace-nowrap text-lg font-semibold">
                Leader Commission
              </span>
            </div>
            {isLoading ? (
              <Spinner />
            ) : (
              <div className="text-[32px] font-bold">
                {formatNumber(data?.leader_commission ?? 0)}%
              </div>
            )}
          </div>
        </div>
        <div className="inline-flex justify-between gap-6 rounded-md border border-line-2 bg-component bg-[url(/dashboard/dots-bg.png)] bg-cover bg-right-top bg-no-repeat p-10">
          <div className="flex flex-col gap-5">
            <div className="inline-flex items-center gap-3">
              <span className="whitespace-nowrap text-lg font-semibold">
                Downline Volume
              </span>
            </div>
            {isLoading ? (
              <Spinner />
            ) : (
              <div className="text-[32px] font-bold">
                {formatNumber(data?.downline_volume ?? 0)} USDT
              </div>
            )}
          </div>
        </div>
        <div className="inline-flex justify-between gap-6 rounded-md border border-line-2 bg-component bg-[url(/dashboard/dots-bg.png)] bg-cover bg-right-top bg-no-repeat p-10">
          <div className="flex flex-col gap-5">
            <div className="inline-flex items-center gap-3">
              <span className="whitespace-nowrap text-lg font-semibold">
                Leader Rewards
              </span>
            </div>
            {isLoading ? (
              <Spinner />
            ) : (
              <div className="text-[32px] font-bold">
                {formatNumber(data?.leader_reward ?? 0)} USDT
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const Withdraw: FC = () => {
  const [open, setOpen] = useState(false)
  const { data, refetch, isLoading } = useReferralPerformance()
  const { user } = useStore(UserStore)
  const chainId = useChainId()

  async function withdraw() {
    if (!data) return
    setOpen(false)
    const toast = toaster.loading({
      title: "Sending withdrawal request",
      description: "Please wait",
    }) as any as string
    try {
      const res = await userService.withdraw({
        amount: data.withdrawal_amount,
        chain_id: chainId.toString(),
      })

      if (res.data) {
        refetch()
        toaster.update(toast, {
          type: "success",
          title: "Withdrawal request sent",
          duration: 5000,
          description: (
            <Link
              to="/withdrawal-history"
              className="inline-flex items-center gap-2"
            >
              Check withdrawal orders <IconSax.ExportSquare size={12} />
            </Link>
          ),
        })
      }
    } catch (err) {
      toaster.update(toast, {
        type: "error",
        title: "Withdraw failed",
        description: (err as Error).message,
      })
    }
  }

  if (!user || !data) return

  return (
    <div className="space-y-[52px]">
      <div className="text-2xl font-semibold">Withdraw</div>
      <div className="relative flex w-full flex-col items-stretch gap-6 rounded-md bg-component px-6 py-8 sm:flex-row sm:items-center sm:px-20 sm:py-[52px]">
        <div className="inline-flex grow items-center gap-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="52"
            height="52"
            viewBox="0 0 52 52"
            fill="none"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M26.6073 2.6439C25.9727 2.00933 24.944 2.00933 24.3094 2.6439L21.5527 5.40042C20.9343 6.01887 20.0552 6.30056 19.1924 6.15678L14.8922 5.44007C14.2679 5.33605 13.6401 5.60387 13.2832 6.12647C12.9262 6.64905 12.9052 7.33133 13.2292 7.87495L16.3724 13.1486C16.5287 13.4109 16.8115 13.5715 17.1168 13.5715H33.7998C34.1053 13.5715 34.3881 13.4109 34.5443 13.1486L37.6875 7.87495C38.0116 7.33133 37.9906 6.64905 37.6335 6.12647C37.2767 5.60387 36.6488 5.33605 36.0245 5.44007L31.7244 6.15678C30.8616 6.30056 29.9826 6.01887 29.364 5.40042L26.6073 2.6439ZM15.3883 16.023C15.5514 15.8408 15.7844 15.7382 16.0289 15.7382H34.8888C35.1332 15.7382 35.3661 15.8408 35.5292 16.023C37.4914 18.2135 39.7711 21.0794 41.7541 24.2745C43.9127 27.7531 45.7789 31.7152 46.4375 35.6794C47.0678 39.4697 45.6116 42.796 43.1096 45.1189C40.6324 47.4186 37.1204 48.7608 33.4575 48.7608H17.4602C13.7972 48.7608 10.2852 47.4186 7.80803 45.1189C5.30585 42.796 3.84988 39.4697 4.47988 35.6794C5.13878 31.715 7.00476 27.7531 9.16358 24.2745C11.1465 21.0794 13.4261 18.2135 15.3883 16.023ZM27.0834 23.293C27.0834 22.3955 26.3558 21.668 25.4584 21.668C24.5609 21.668 23.8334 22.3955 23.8334 23.293V24.0158C22.9359 24.2205 22.1094 24.5941 21.4192 25.1115C20.3272 25.9305 19.5 27.186 19.5 28.7096C19.5 30.2332 20.3272 31.4888 21.4192 32.3078C22.5108 33.1264 23.9441 33.5846 25.4584 33.5846C26.3374 33.5846 27.0706 33.854 27.5475 34.2115C28.0239 34.5687 28.1667 34.9384 28.1667 35.2096C28.1667 35.4809 28.0239 35.8505 27.5475 36.2078C27.0706 36.5653 26.3374 36.8346 25.4584 36.8346C24.0102 36.8346 23.0956 36.1391 22.8415 35.6003C22.459 34.7884 21.4907 34.4405 20.6789 34.8231C19.867 35.2055 19.5191 36.1738 19.9017 36.9857C20.6164 38.5023 22.1245 39.51 23.8334 39.9016V40.6263C23.8334 41.5237 24.5609 42.2513 25.4584 42.2513C26.3558 42.2513 27.0834 41.5237 27.0834 40.6263V39.9035C27.9808 39.6988 28.8074 39.3252 29.4975 38.8078C30.5895 37.9888 31.4167 36.7332 31.4167 35.2096C31.4167 33.686 30.5895 32.4305 29.4975 31.6115C28.4059 30.7929 26.9727 30.3346 25.4584 30.3346C24.5793 30.3346 23.8461 30.0653 23.3693 29.7078C22.8928 29.3505 22.75 28.9809 22.75 28.7096C22.75 28.4384 22.8928 28.0687 23.3693 27.7115C23.8461 27.354 24.5793 27.0846 25.4584 27.0846C26.9066 27.0846 27.8211 27.7801 28.0753 28.319C28.4577 29.1308 29.426 29.4788 30.2378 29.0962C31.0497 28.7138 31.3976 27.7455 31.015 26.9336C30.3002 25.417 28.7922 24.4092 27.0834 24.0177V23.293Z"
              fill="white"
            />
          </svg>
          <div className="h-20 w-px bg-line-2" />
          <div>
            <div className="text-lg font-medium">Available to Withdraw</div>
            {isLoading ? (
              <Spinner />
            ) : (
              <div className="text-[32px] font-bold">
                {formatNumber(data?.withdrawal_amount ?? 0)} USDT
              </div>
            )}
          </div>
        </div>
        <Button
          disabled={!data?.withdrawal_amount || data.withdrawal_amount < 100}
          onClick={() => setOpen(true)}
          size="lg"
          color="primary"
          rightIcon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M5.93712 2.25196C5.95963 2.25196 5.98222 2.25197 6.00488 2.25197L18.0628 2.25196C18.9469 2.25191 19.7124 2.25186 20.3261 2.33758C20.9883 2.43006 21.6192 2.63907 22.1269 3.16645C22.6295 3.6885 22.8237 4.32815 22.9104 4.99757C22.9919 5.62741 22.9919 6.41579 22.9918 7.33935V7.40373C22.9918 7.65635 22.994 7.89907 22.9961 8.13021C23.0016 8.73269 23.0063 9.25651 22.9695 9.6721C22.9123 10.3174 22.7444 10.9178 22.2364 11.4455C21.8534 11.8434 21.2204 11.8555 20.8225 11.4724C20.4246 11.0894 20.4126 10.4564 20.7956 10.0585C20.8729 9.97812 20.9429 9.883 20.9773 9.49546C21.0051 9.18242 21.0016 8.80856 20.9967 8.26896C20.9944 8.01945 20.9918 7.73449 20.9918 7.40373C20.9918 6.39791 20.9898 5.74043 20.9269 5.25428C20.8672 4.79311 20.7688 4.63947 20.6861 4.55351C20.6084 4.47288 20.4757 4.37788 20.0495 4.31836C19.5905 4.25425 18.9665 4.25197 17.9951 4.25197H6.00488C5.03351 4.25197 4.40942 4.25425 3.95045 4.31835C3.52427 4.37788 3.39151 4.47288 3.31389 4.5535C3.23113 4.63947 3.13273 4.79311 3.07304 5.25428C3.01012 5.74043 3.00815 6.39791 3.00815 7.40373C3.00815 7.73622 3.0055 8.02241 3.00318 8.27283C2.99819 8.81048 2.99474 9.18331 3.02234 9.49579C3.05658 9.88343 3.12657 9.97832 3.2037 10.0585C3.58672 10.4564 3.57468 11.0894 3.1768 11.4724C2.77891 11.8555 2.14586 11.8434 1.76284 11.4455C1.25466 10.9176 1.08709 10.317 1.0301 9.67177C0.99347 9.25711 0.998268 8.7344 1.00378 8.13338C1.00591 7.90127 1.00815 7.65748 1.00815 7.40373C1.00815 7.38219 1.00815 7.36073 1.00815 7.33934C1.00811 6.41578 1.00807 5.62741 1.08959 4.99757C1.17623 4.32815 1.37048 3.6885 1.87303 3.16645C2.38072 2.63907 3.01163 2.43006 3.67381 2.33758C4.28758 2.25186 5.0531 2.25191 5.93712 2.25196Z"
                fill="black"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 6.25195C7.7198 6.25195 4.25 9.72174 4.25 14.002C4.25 18.2822 7.7198 21.752 12 21.752C16.2802 21.752 19.75 18.2822 19.75 14.002C19.75 9.72174 16.2802 6.25195 12 6.25195ZM12.75 10.002C12.75 9.58774 12.4142 9.25195 12 9.25195C11.5858 9.25195 11.25 9.58774 11.25 10.002V10.3345C10.836 10.4289 10.4545 10.6011 10.1361 10.8397C9.6321 11.2173 9.25 11.7964 9.25 12.4995C9.25 13.2026 9.6321 13.7817 10.1361 14.1593C10.6398 14.5368 11.3013 14.748 12 14.748C12.4059 14.748 12.7444 14.8723 12.9645 15.0372C13.1844 15.2019 13.25 15.3721 13.25 15.4966C13.25 15.621 13.1844 15.7912 12.9645 15.9559C12.7444 16.1209 12.4059 16.2451 12 16.2451C11.3313 16.2451 10.9092 15.9242 10.7921 15.676C10.6154 15.3014 10.1684 15.141 9.79378 15.3178C9.41917 15.4945 9.25876 15.9415 9.43551 16.3161C9.76579 17.0161 10.4627 17.4809 11.2518 17.661L11.2528 18.0041C11.2539 18.4183 11.5906 18.7531 12.0048 18.752C12.419 18.7509 12.7539 18.4142 12.7528 17.9999L12.7518 17.6611C13.1652 17.5666 13.546 17.3946 13.864 17.1564C14.3679 16.7788 14.75 16.1997 14.75 15.4966C14.75 14.7935 14.3679 14.2143 13.864 13.8367C13.3602 13.4593 12.6987 13.248 12 13.248C11.5941 13.248 11.2556 13.1238 11.0355 12.9589C10.8156 12.7942 10.75 12.624 10.75 12.4995C10.75 12.375 10.8156 12.2049 11.0355 12.0401C11.2556 11.8752 11.5941 11.751 12 11.751C12.6688 11.751 13.0908 12.0719 13.2079 12.32C13.3847 12.6947 13.8316 12.8551 14.2062 12.6783C14.5809 12.5016 14.7413 12.0546 14.5645 11.68C14.2345 10.9805 13.5385 10.5159 12.75 10.3355V10.002Z"
                fill="black"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M5 7.00195C5 6.44967 5.44772 6.00195 6 6.00195H18C18.5523 6.00195 19 6.44967 19 7.00195C19 7.55423 18.5523 8.00195 18 8.00195H6C5.44772 8.00195 5 7.55423 5 7.00195Z"
                fill="black"
              />
            </svg>
          }
        >
          Withdraw Now
        </Button>
        <img
          src="/dashboard/money-bag.png"
          alt=""
          className="pointer-events-none absolute right-0 top-0 h-full scale-125 object-contain"
          width={150}
        />
      </div>
      <Dialog open={open} onOpenChange={({ open }) => setOpen(open)}>
        <Dialog.Content className="max-w-[500px]">
          <Dialog.Title>
            Withdrawal Request <Dialog.CloseTrigger />
          </Dialog.Title>
          <hr className="mb-6 border border-line-2" />
          <div className="flex flex-col gap-8">
            <Field>
              <Field.Label className="inline-flex items-center justify-between gap-4">
                <span>Amount to Withdraw</span>
                <span className="font-semibold text-foreground">
                  {formatNumber(data?.withdrawal_amount)} USDT
                </span>
              </Field.Label>
              <Button size="lg" className="justify-between px-4 font-normal">
                <span>Network</span>
                <div className="inline-flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                  >
                    <g clipPath="url(#clip0_1030_2813)">
                      <path
                        d="M19.6875 10C19.6875 15.3503 15.3503 19.6875 10 19.6875C4.64973 19.6875 0.3125 15.3503 0.3125 10C0.3125 4.64973 4.64973 0.3125 10 0.3125C15.3503 0.3125 19.6875 4.64973 19.6875 10ZM14.1543 8.61992C14.3471 7.3309 13.3655 6.63793 12.0234 6.17566L12.4588 4.42949L11.3958 4.16461L10.9719 5.86477C10.6925 5.79512 10.4054 5.72945 10.1202 5.66437L10.5471 3.95305L9.48473 3.68816L9.04906 5.43371C8.81773 5.38102 8.59066 5.32895 8.37027 5.27418L8.37148 5.26871L6.90547 4.9027L6.6227 6.03793C6.6227 6.03793 7.41141 6.21867 7.39477 6.22984C7.82531 6.3373 7.90312 6.62219 7.89008 6.84801L7.39414 8.83727C7.42383 8.84484 7.46227 8.85574 7.50465 8.8727C7.46922 8.86391 7.43137 8.85422 7.3923 8.84484L6.69715 11.6315C6.64445 11.7623 6.51094 11.9584 6.21 11.884C6.22059 11.8994 5.43734 11.6911 5.43734 11.6911L4.90961 12.9078L6.29297 13.2526C6.55031 13.3171 6.80254 13.3846 7.05078 13.4482L6.61086 15.2143L7.67266 15.4792L8.10832 13.7318C8.3899 13.8081 8.6723 13.8814 8.95547 13.9516L8.52129 15.6908L9.5843 15.9557L10.0242 14.1929C11.8369 14.5359 13.2 14.3975 13.7737 12.7582C14.236 11.4383 13.7507 10.6769 12.797 10.1804C13.4915 10.0204 14.0147 9.56355 14.1543 8.61992ZM11.7255 12.0254C11.397 13.3453 9.17438 12.6317 8.45379 12.4528L9.03754 10.113C9.75809 10.2928 12.0688 10.6488 11.7255 12.0254ZM12.0543 8.60086C11.7545 9.80149 9.90461 9.19148 9.30453 9.04195L9.83375 6.9198C10.4339 7.06934 12.3664 7.34844 12.0543 8.60086Z"
                        fill="white"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_1030_2813">
                        <path d="M0 0H20V20H0V0Z" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                  <span>BEP-20 (Binance Smart Chain)</span>
                </div>
              </Button>
            </Field>
            <Field>
              <Field.Label className="inline-flex items-center justify-between gap-4">
                <span>Withdrawal Wallet</span>
              </Field.Label>
              <Button size="lg" className="justify-between px-4 font-normal">
                <IconSax.Wallet2 variant="Bold" />
                <span>{formatAddress(user.wallet)}</span>
              </Button>
              <Field.HelperText>
                {
                  "This is your connected MetaMask wallet address. Please verify it's correct."
                }
              </Field.HelperText>
            </Field>
            <div className="flex flex-col gap-4">
              <div className="inline-flex items-center gap-3 rounded-[4px] bg-component px-4 py-3">
                <IconSax.Warning2 />
                <span className="text-sm text-secondary">
                  Your withdrawal will be processed automatically as the amount
                  is under $1,000 USDT.
                </span>
              </div>
            </div>
          </div>
          <hr className="my-8 border border-line-2" />
          <Button
            size="lg"
            color="primary"
            className="w-full"
            onClick={withdraw}
          >
            Submit Withdrawal Request
          </Button>
        </Dialog.Content>
      </Dialog>
    </div>
  )
}
