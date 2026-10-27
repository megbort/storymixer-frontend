import {
  HeadContent,
  Scripts,
  Link,
  createRootRoute,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import Header from '../components/Header'
import Footer from '../components/Footer'
import { PageWrapper } from '../components/PageWrapper'
import { GuestNotice } from '@/components/GuestSaveBanner'
import { Button } from '@/components/ui/button'

import '@/styles.css'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'StoryMixer',
      },
    ],
  }),

  shellComponent: RootDocument,
  notFoundComponent: NotFound,
})

function RootDocument({ children }: { readonly children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <Header />
        <GuestNotice />
        <PageWrapper>{children}</PageWrapper>
        <Footer />
        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}

function NotFound() {
  return (
    <div className="text-center py-12">
      <h1 className="text-3xl font-bold mb-3">Page not found</h1>
      <p className="text-storymixer-grey mb-6">
        We couldn't find that page. Try heading back home.
      </p>
      <Button asChild>
        <Link to="/">Back to stories</Link>
      </Button>
    </div>
  )
}
