import { appKitModal } from "@/config/web3.config"
import {
  Badge,
  Button,
  Container,
  Countdown,
  Input,
  NumberInput,
  Progress,
  RadioGroup,
  Select,
  Spinner,
  Tabs,
} from "@/shared/components"
import { useCountdown } from "@/shared/hooks/use-countdown"
import { useViewWidth } from "@/shared/hooks/use-view-width"
import { Icon, IconSax } from "@/shared/icons"
import { formatNumber } from "@/shared/utils/number"
import { createListCollection, Portal } from "@ark-ui/react"
import { useAppKitAccount } from "@reown/appkit/react"
import useEmblaCarousel from "embla-carousel-react"
import { FC, useCallback, useEffect, useRef, useState } from "react"
import { isMobile } from "react-device-detect"
import { HiMinus, HiPlus } from "react-icons/hi"
import { useSearchParams } from "react-router-dom"
import { cn } from "react-tvcx"
import { useStore } from "use-valtio-store"
import { useUSDCBalance } from "../root/use-usdt-balance"
import UserStore from "../user/user.store"
import { Round, Tier } from "./event.interface"
import { RecentTransactions } from "./recent-transactions"
import { TopReferrers } from "./top-referrers"
import { useBuyPackage } from "./use-buy-package"
import { useCurrentRoundInfo } from "./use-current-round"
import { useEvent } from "./use-event"
import { useValidRefCode } from "./use-valid-ref-code"
import { useWhitelist } from "./use-whitelist"

export const Sale: FC = () => {
  const { user, isLeader } = useStore(UserStore)
  const [slideRef, slideApi] = useEmblaCarousel()
  const saleBoxRef = useRef<HTMLDivElement>(null)
  const [scrollAreaHeight, setScrollAreaHeight] = useState<number>(0)
  const vw = useViewWidth()

  useEffect(() => {
    const saleBox = saleBoxRef.current
    if (!saleBox) return

    const observer = new ResizeObserver(entries => {
      for (const entry of entries) {
        const height = entry.contentRect.height
        setScrollAreaHeight(height)
      }
    })

    observer.observe(saleBox)
    return () => observer.disconnect()
  }, [])

  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true)
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true)

  const onSelect = useCallback((slideApi: any) => {
    setPrevBtnDisabled(!slideApi.canScrollPrev())
    setNextBtnDisabled(!slideApi.canScrollNext())
  }, [])

  useEffect(() => {
    if (!slideApi) return

    onSelect(slideApi)
    slideApi.on("reInit", onSelect).on("select", onSelect)
  }, [slideApi, onSelect])

  const { address: isConnected } = useAppKitAccount()

  const { data: event } = useEvent()

  const { data: isWhitelist } = useWhitelist()

  const [searchParams] = useSearchParams()

  const refCodeParams = searchParams.get("ref") ?? undefined

  const { data: usdtBalance } = useUSDCBalance()

  const [refCode, setRefCode] = useState<string>()

  const { data: isValidRefCode, isFetching: isCheckingRefCode } =
    useValidRefCode(refCode)

  useEffect(() => {
    setRefCode("")
    if (refCodeParams && user && !user.referral) {
      setRefCode(refCodeParams)
    }
  }, [refCodeParams, user])

  const {
    data: currentRoundInfo,
    currentRound,
    currentTier,
  } = useCurrentRoundInfo()

  const whitelistCountdown = useCountdown((currentRound?.end_time ?? 0) * 1000)

  const endTimeCountdown = useCountdown((event?.end_time ?? 0) * 1000)

  const countdown = whitelistCountdown.isFinished
    ? endTimeCountdown
    : whitelistCountdown

  const isWhitelistRestricted =
    !whitelistCountdown.isFinished && isWhitelist === false

  const [value, setValue] = useState("1")
  const [pack, setPack] = useState<string>(packageOptions[0].value)

  const _insufficientBalance =
    usdtBalance !== undefined &&
    +value &&
    currentTier &&
    +value * +pack > usdtBalance

  const _insufficientAmount =
    currentTier &&
    currentRoundInfo &&
    currentTier.total_money - currentRoundInfo.money_sold < +value * +pack

  useEffect(() => {
    if (event?.rounds && currentRoundInfo && slideApi) {
      const allTiers = event.rounds
        .map(round => ({
          ...round,
          tiers: round.tiers.map(tier => ({
            ...tier,
            round: round.round_number,
          })),
        }))
        .flatMap(round => round.tiers)

      const index = allTiers.findIndex(
        tier =>
          tier.tier_number === currentRoundInfo.current_tier_number &&
          tier.round === currentRoundInfo.current_round_number,
      )

      if (vw < 640) {
        slideApi.scrollTo(index)
      } else {
        slideApi.scrollTo(index - 1)
      }
    }
  }, [slideApi, currentRoundInfo, vw])

  const buyPackage = useBuyPackage()

  async function submit() {
    if (!event || !currentRound || !currentTier) return

    return buyPackage(
      event.event_id,
      value,
      pack,
      currentRound.round_number,
      currentTier.tier_number,
      refCode,
    )
  }

  if (!currentTier || !currentRoundInfo) return null

  return (
    <Container className="flex flex-col gap-10 px-0 xl:flex-row xl:px-6">
      <div
        ref={saleBoxRef}
        className="flex grow flex-col overflow-hidden border-y border-line bg-component p-6 backdrop-blur sm:p-8 xl:rounded-xl xl:border"
      >
        <div className="inline-flex flex-wrap items-center justify-between gap-4">
          <div className="inline-flex items-center gap-2">
            <Icon.ProtocolHandler className="text-xl text-primary sm:text-2xl" />
            <span className="text-lg font-bold text-primary sm:text-2xl">
              Buy Token Package
            </span>
          </div>
          {!whitelistCountdown.isFinished ? (
            <Badge size="lg" color="foreground" className="relative rounded">
              <span className="pointer-events-none absolute inset-0 -z-10 animate-miniping rounded-[inherit] ring ring-foreground delay-300 duration-1000 repeat-infinite" />
              <IconSax.MagicStar size={20} variant="Bold" />
              <span>Whitelist</span>
            </Badge>
          ) : null}
        </div>
        <hr className="my-[28px] w-full border border-foreground/10" />
        <div className="relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-md border border-foreground/10 bg-countdown bg-cover bg-center bg-no-repeat py-6 sm:gap-6">
          <div className="absolute inset-0 -translate-x-full animate-aero bg-[linear-gradient(135deg,_#00000000_12%,_#ffffff_19%,_#00000000_31%)] opacity-10 repeat-infinite [animation-duration:4s]" />
          <div className="inline-flex items-center gap-1 text-sm sm:text-base">
            <IconSax.Flashy variant="Bold" size={20} />
            <span className="font-medium">
              {whitelistCountdown.isFinished
                ? "Sales End In"
                : "Whitelist Sales End In"}
            </span>
          </div>
          <div className="inline-flex items-end gap-1.5">
            <Countdown
              value={countdown.days}
              maxValue={500}
              className="text-xl font-bold"
            />
            <span className="align-bottom leading-[1.1]">d</span>
          </div>
          <div className="inline-flex items-end gap-1.5">
            <Countdown value={countdown.hours} className="text-xl font-bold" />
            <span className="align-bottom leading-[1.1]">h</span>
          </div>
          <div className="inline-flex items-end gap-1.5">
            <Countdown
              value={countdown.minutes}
              className="text-xl font-bold"
            />
            <span className="align-bottom leading-[1.1]">m</span>
          </div>
          <div className="inline-flex items-end gap-1.5">
            <Countdown
              value={countdown.seconds}
              className="text-xl font-bold"
            />
            <span className="align-bottom leading-[1.1]">s</span>
          </div>
        </div>
        <div className="group relative">
          {prevBtnDisabled ? null : (
            <Button
              shape="circle"
              leftIcon={<IconSax.ArrowLeft size={20} />}
              className={cn(
                "absolute bottom-12 left-0 z-50 -translate-x-1/2 sm:top-1/2 sm:-translate-y-1/2",
                {
                  "pointer-events-none opacity-0 group-hover:pointer-events-auto group-hover:opacity-100":
                    !isMobile,
                },
              )}
              onClick={() => slideApi?.scrollPrev()}
            />
          )}
          {nextBtnDisabled ? null : (
            <Button
              shape="circle"
              leftIcon={<IconSax.ArrowRight size={20} />}
              className={cn(
                "absolute bottom-12 right-0 z-50 translate-x-1/2 sm:top-1/2 sm:-translate-y-1/2",
                {
                  "pointer-events-none opacity-0 group-hover:pointer-events-auto group-hover:opacity-100":
                    !isMobile,
                },
              )}
              onClick={() => slideApi?.scrollNext()}
            />
          )}
          <div ref={slideRef} className="relative overflow-hidden py-8">
            <div className="grid auto-cols-[100%] grid-flow-col gap-[28px] sm:auto-cols-[calc((100%-56px)/3)]">
              {event?.rounds?.map(round =>
                round.tiers.map(tier => (
                  <SaleCard
                    round={round}
                    tier={tier}
                    key={`${round.round_number}.${tier.tier_number}`}
                  />
                )),
              )}
            </div>
          </div>
        </div>
        {isWhitelistRestricted ? (
          <div className="mb-8 w-full rounded border border-line-2 bg-component px-4 py-6 text-center">
            {"Oop! You're not on our whitelist squad."}
          </div>
        ) : null}
        <div className="flex flex-col rounded-md border border-line-2 p-6 px-4 sm:px-6">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-center xl:flex-col xl:items-stretch 2xl:flex-row 2xl:items-center">
            <label className="inline-flex flex-1 items-center gap-6 sm:gap-[52px]">
              <span className="min-w-24 flex-none font-medium">Package</span>
              <RadioGroup
                value={pack}
                onValueChange={({ value }) => setPack(value as any)}
                classNames={{
                  base: "flex-row gap-4 flex-wrap hidden sm:flex",
                  item: "px-4 py-2.5 gap-2 text-sm bg-component border border-line-2 rounded-[4px]",
                }}
              >
                {packageOptions.map(item => (
                  <RadioGroup.Item key={item.value} value={item.value}>
                    {item.label}
                  </RadioGroup.Item>
                ))}
              </RadioGroup>
              <Select
                value={[pack]}
                onValueChange={({ value }) => setPack(value[0])}
                collection={createListCollection({
                  items: packageOptions,
                  itemToString: i => i.label,
                  itemToValue: i => i.value,
                })}
                classNames={{ base: "w-full sm:hidden" }}
              >
                <Select.Trigger asChild>
                  <Button
                    className="w-full border-line-2 bg-transparent"
                    rightIcon={<IconSax.ArrowDown2 size={16} />}
                  >
                    <Select.ValueText />
                  </Button>
                </Select.Trigger>
                <Portal>
                  <Select.Content>
                    {packageOptions.map(item => (
                      <Select.Item item={item} key={item.value}>
                        {item.label}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Portal>
              </Select>
            </label>
          </div>
          <hr className="my-6 border border-line-2" />
          <div className="flex flex-col gap-10 lg:flex-row lg:items-center xl:flex-col xl:items-stretch 2xl:flex-row 2xl:items-center">
            <label className="inline-flex flex-1 items-center gap-6 sm:gap-[52px]">
              <span className="min-w-24 flex-none font-medium">Quantity</span>
              <NumberInput
                defaultValue="1"
                min={1}
                max={Math.floor(
                  Math.min(
                    (usdtBalance ?? 0) / +pack,
                    (currentTier.total_money - currentRoundInfo.money_sold) /
                      +pack,
                    10,
                  ),
                )}
                value={value}
                onValueChange={({ value }) => setValue(value)}
                className="w-full"
              >
                <NumberInput.Input asChild>
                  <Input
                    prefix={
                      <NumberInput.DecrementTrigger className="flex-none">
                        <HiMinus />
                      </NumberInput.DecrementTrigger>
                    }
                    suffix={
                      <NumberInput.IncrementTrigger className="flex-none">
                        <HiPlus />
                      </NumberInput.IncrementTrigger>
                    }
                    maxLength={6}
                    onKeyDown={function (e) {
                      if ([".", ",", "-"].includes(e.key)) {
                        e.preventDefault()
                      }
                    }}
                    onPaste={function (e) {
                      const paste = e.clipboardData.getData("text")
                      if (/[.,-]/.test(paste)) {
                        e.preventDefault()
                      }
                    }}
                    className="w-full overflow-hidden"
                    classNames={{
                      input: "text-center grow min-w-0 w-full",
                    }}
                  />
                </NumberInput.Input>
              </NumberInput>
            </label>
            <div className="hidden h-full w-px flex-none bg-line-2 lg:block xl:hidden" />

            <label className="inline-flex flex-1 items-center gap-6 sm:gap-[52px]">
              <span className="flex-none font-medium">Referral Code</span>
              <Input
                value={user?.referral ? user.referral : refCode}
                onChange={e => setRefCode(e.target.value)}
                placeholder="Enter Referral Code"
                className="w-full"
                suffix={
                  isCheckingRefCode ? <Spinner className="flex-none" /> : null
                }
                disabled={!!user?.referral || isLeader}
              />
            </label>
          </div>
          {!!refCode?.trim() &&
          isValidRefCode !== undefined &&
          !isValidRefCode ? (
            <div className="mt-4 text-sm text-error">
              Referral code is invalid
            </div>
          ) : null}
          <hr className="my-6 border border-line-2" />
          <div className="inline-flex items-center justify-between gap-4">
            <span className="font-medium">Total Amount</span>
            <span className="text-xl font-semibold text-primary">
              {formatNumber(+value * +pack)} USDC
            </span>
          </div>
        </div>
        <Button
          size="lg"
          color="primary"
          leftIcon={
            isConnected ? (
              <Icon.USDC fontSize={24} />
            ) : (
              <IconSax.Wallet2 variant="Bold" />
            )
          }
          className="mt-8"
          onClick={async function () {
            if (isConnected) {
              return submit()
            } else {
              return appKitModal.open()
            }
          }}
          disabled={
            !!isConnected &&
            (!+value ||
              isWhitelistRestricted ||
              _insufficientBalance ||
              _insufficientAmount ||
              (!!refCode?.trim() && !isValidRefCode))
          }
        >
          {isConnected
            ? _insufficientBalance
              ? "Insufficient Balance"
              : _insufficientAmount
                ? "Insufficient Amount"
                : `Pay ${+value ? formatNumber(+pack * +value) : "by"} USDC`
            : "Connect Wallet to Purchase"}
        </Button>
      </div>
      <Tabs
        defaultValue="0"
        classNames={{
          base: "p-6 xl:border border-line border-y xl:rounded-xl sm:min-w-[540px] backdrop-blur bg-component flex flex-col overflow-hidden",
          list: "w-full",
          trigger: "flex-1 text-sm sm:text-base",
          content: "grow min-h-0",
        }}
        style={{ height: scrollAreaHeight + 64 }}
      >
        <Tabs.List>
          <Tabs.Trigger value="0">
            <IconSax.ArrowSwapHorizontal
              variant="Bold"
              className="hidden sm:block"
            />{" "}
            Recent Transactions
          </Tabs.Trigger>
          <Tabs.Trigger value="1">
            <IconSax.Rank variant="Bold" className="hidden sm:block" />
            Top Referrers
          </Tabs.Trigger>
        </Tabs.List>

        <hr className="my-6 w-full border border-foreground/10" />

        <Tabs.Content value="0">
          <RecentTransactions />
        </Tabs.Content>
        <Tabs.Content value="1">
          <TopReferrers />
        </Tabs.Content>
      </Tabs>
    </Container>
  )
}

const SaleCard: FC<{ round: Round; tier: Tier }> = ({ round, tier }) => {
  const { data: currentRoundInfo } = useCurrentRoundInfo()

  const _isPrevTier =
    currentRoundInfo &&
    (round.round_number < currentRoundInfo.current_round_number ||
      (round.round_number === currentRoundInfo.current_round_number &&
        tier.tier_number < currentRoundInfo.current_tier_number))

  const _isNextTier =
    currentRoundInfo &&
    (round.round_number > currentRoundInfo.current_round_number ||
      (round.round_number === currentRoundInfo.current_round_number &&
        tier.tier_number > currentRoundInfo.current_tier_number))

  const _isCurrentTier =
    currentRoundInfo &&
    round.round_number === currentRoundInfo.current_round_number &&
    tier.tier_number === currentRoundInfo.current_tier_number

  const _currentPercentage =
    currentRoundInfo && (currentRoundInfo.money_sold * 100) / tier.total_money

  if (!currentRoundInfo) return

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-md border border-transparent bg-component p-5",
        {
          "border-foreground": _isCurrentTier,
          "opacity-50": !_isCurrentTier,
        },
      )}
    >
      <IconSax.Box
        variant="Bold"
        size={150}
        className="absolute -right-[31px] -top-[38px] text-[150px] text-foreground text-opacity-[3%]"
      />
      <IconSax.Box variant="Bold" />
      <div className="mt-4 text-lg font-medium">
        {round.round_name} {tier.tier_number}
      </div>
      <Badge size="xs" color="foreground" className="mt-2">
        {_isPrevTier ? "Completed" : _isNextTier ? "Upcoming" : "Active"}
      </Badge>
      <Progress
        value={_isPrevTier ? 100 : _isNextTier ? 0 : _currentPercentage}
        className="mt-6"
      >
        <Progress.Track>
          <Progress.Range />
        </Progress.Track>
      </Progress>
      <div className="mt-2 inline-flex w-full items-center justify-between gap-2">
        <span className="text-secondary">
          $
          {formatNumber(
            _isPrevTier
              ? tier.total_money
              : _isNextTier
                ? 0
                : currentRoundInfo.money_sold,
          )}
        </span>
        <span className="font-medium">
          $
          {formatNumber(
            _isPrevTier
              ? 0
              : _isNextTier
                ? tier.total_money
                : tier.total_money - currentRoundInfo.money_sold,
          )}
        </span>
      </div>
      <div className="my-4 h-px w-full bg-gradient-to-r from-component via-foreground/40 to-foreground/5" />
      <div className="inline-flex w-full items-center justify-center gap-2.5">
        <Icon.USD fontSize={24} />
        <div className="inline-flex items-center gap-1">
          <span className="text-xl font-semibold">{tier.token_price} USDC</span>
          <span className="text-lg text-secondary">/token</span>
        </div>
      </div>
    </div>
  )
}

const packageOptions = [
  { value: "100", label: "$100" },
  { value: "300", label: "$300" },
  { value: "500", label: "$500" },
  { value: "1000", label: "$1,000" },
  { value: "5000", label: "$5,000" },
]
