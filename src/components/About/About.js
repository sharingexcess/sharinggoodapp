import { ExternalLink, Spacer, Text } from '@sharingexcess/designsystem'
import { Page } from 'components'

export function About() {
  return (
    <Page id="About">
      <Text type="secondary-header">
        Connecting our community heroes with the community.
      </Text>

      <Spacer height={8} />

      <Text type="small" color="grey">
        A collaboration between{' '}
        <ExternalLink to="https://sharingexcess.com">
          Sharing Excess
        </ExternalLink>{' '}
        and{' '}
        <ExternalLink to="https://forgoodpgh.org">For Good PGH</ExternalLink>,
        Sharing Good helps teachers and social workers request donations from
        the local community to support students in need.
      </Text>

      <Spacer height={32} />

      <img src="/about.png" alt="About" />
      <Text type="small" color="grey" align="center">
        <i>SE & FG teams meeting for the first time in 2021</i>
      </Text>

      <Spacer height={32} />

      <Text>
        America has a problem with waste. Over <b>40% of all food</b> produced
        in the US is thrown away every year, while <b>85% of our clothing</b>{' '}
        and textiles end up in a landfill. These numbers are alarming on their
        own, but even worse when matched with conditions of real and dire need.
        Today, <b>1 in 6 children</b> live below the poverty line in the US, and
        struggle to meet their basic needs day by day.
      </Text>
      <Spacer height={12} />
      <Text>
        <ExternalLink to="https://sharingexcess.com">
          Sharing Excess
        </ExternalLink>{' '}
        and{' '}
        <ExternalLink to="https://forgoodpgh.org">For Good PGH</ExternalLink>,
        both Pennsylvania based nonprofits first met in 2021. The two PA based
        nonprofits found connection in their goal of recovering and distributing
        surplus goods to fight poverty in their communities. Fueled by Sharing
        Excess's background in using technology to bring community volunteers
        together, and For Good's deep roots with local public schools, and idea
        was formed.
      </Text>

      <Spacer height={32} />

      <img src="/about2.png" alt="About" />
      <Text type="small" color="grey" align="center">
        <i>
          Volunteers outside{' '}
          <ExternalLink to="https://freestore15104.org">
            Free Store 15104
          </ExternalLink>{' '}
          in Braddock, PA
        </i>
      </Text>

      <Spacer height={32} />

      <Text>
        After years of running the country's first free store in Braddock, PA,
        For Good's founders built a deep relationship with the teachers, social
        workers, and administrators of the local public school system. As one of
        few truly no-questions-asked mutual aid organizations, Gisele and
        Kristin became the go-to resource for immediate needs like clothing,
        bedding, and school supplies.
      </Text>
      <Spacer height={16} />
      <Text bold>
        With Sharing Good, we're excited to make supporting those in need easier
        than ever.
      </Text>

      <Spacer height={32} />

      <img src="/og.png" alt="About" />
      <Text type="small" color="grey" align="center">
        <i>A first look at the Sharing Good App</i>
      </Text>

      <Spacer height={32} />
      <Text>
        Built in collaboration with Sharing Excess, Sharing Good is a space for
        verified teachers and social workers to reach out directly to donors,
        and coordinate giving in a safe a trustworthy process.
      </Text>
      <Spacer height={16} />
      <Text>
        Sharing Good helps community members reach out to provide direct
        support, with safe and secure built in messaging, and moderation from
        the SE and FG teams.
      </Text>
      <Spacer height={16} />
      <Text bold>
        We're so excited to bring this labor of love to you, and can't wait to
        see what amazing good can come of it.
      </Text>
      <Spacer height={24} />
      <Text>
        <i>With love,</i>
      </Text>
      <Text>
        <i>The Sharing Good Team 💚</i>
      </Text>
    </Page>
  )
}
