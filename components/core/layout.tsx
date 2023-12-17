import Head from 'next/head'
import Support from './support'
import Navigation from './navigation'
import { useState } from 'react'
import Image from 'next/future/image'

export const siteTitle = 'Vault Maxi'

interface LayoutProps {
  page?: string
  full?: boolean
  adjustWidth?: boolean
  maxWidth?: boolean
  withoutSupport?: boolean
  children: any
}

const donation = {
  kuegi: 'df1qe9eus79waxmwu8ntjgsjjtspv9hs9kmr8y44x2',
  krysh: 'df1q9ajjm9nt0e4swthswph3ff40d0t4lq26kj4uv4',
}

export default function Layout({
  page,
  full,
  adjustWidth,
  maxWidth,
  withoutSupport,
  children,
}: LayoutProps): JSX.Element {
  return (
    <div className="flex flex-col h-screen">
      <Head>
        <title>{page ? `${siteTitle} - ${page}` : siteTitle}</title>
        <link rel="icon" href="/favicon.ico" />
        <meta charSet="UTF-8" />
        <meta name="description" content="Learn what vault maxi is and how it works" />
        <meta name="og:title" content={siteTitle} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <Navigation />
      <div className="flex justify-center px-2 md:px-8">
        <main
          className={`flex flex-col justify-center items-center py-8 ${full ? 'max-w-screen-2xl' : 'max-w-screen-md'} ${
            maxWidth ? 'w-full' : ''
          } ${adjustWidth ? 'md:w-3/4 lg:w-3/2' : ''}`}
        >
          {children}
          {!withoutSupport ? (
            <Support
              openDonation={() => (document.getElementById('donation_modal') as HTMLDialogElement)?.showModal()}
            />
          ) : (
            <div className="card w-full lg:w-96 bg-neutral text-neutral-content mt-24 mb-24">
              <div className="card-body items-center justify-center w-full">
                <h3>Want to support us?</h3>
                <a
                  className="cursor-pointer"
                  onClick={() => (document.getElementById('donation_modal') as HTMLDialogElement)?.showModal()}
                >
                  Open donation
                </a>
              </div>
            </div>
          )}
          <dialog id="donation_modal" className="modal">
            <div className="modal-box bg-light">
              <h3 className="font-bold text-lg">Donation</h3>
              <p className="py-4">
                Thanks for using our page. If you want to support us, please donate to the addresses below.
              </p>
              <div className="flex flex-col gap-4">
                <div className="flex flex-row flex-wrap justify-between">
                  <p>Krysh</p>
                  <p>{donation.krysh}</p>
                </div>
                <div className="flex flex-row flex-wrap justify-between items-center">
                  <Image
                    src={'/team/krysh-donation.jpeg'}
                    width={128}
                    height={128}
                    alt={'QR code of kryshs donation address'}
                  />
                  <a
                    target="_blank"
                    href={`https://defiscan.live/address/${donation.krysh}`}
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                  >
                    Open address
                  </a>
                </div>
                <div className="flex flex-row flex-wrap justify-between pt-4">
                  <p>Kuegi</p>
                  <p>{donation.kuegi}</p>
                </div>
                <div className="flex flex-row flex-wrap justify-between items-center">
                  <a
                    target="_blank"
                    href={`https://defiscan.live/address/${donation.kuegi}`}
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                  >
                    Open address
                  </a>
                  <Image
                    src={'/team/kuegi-donation.jpeg'}
                    width={128}
                    height={128}
                    alt={'QR code of kuegis donation address'}
                  />
                </div>
              </div>

              <div className="modal-action modal-backdrop">
                <form method="dialog">
                  <button className="btn">Close</button>
                </form>
              </div>
            </div>
          </dialog>
        </main>
      </div>
    </div>
  )
}
