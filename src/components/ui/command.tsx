// This is a placeholder file to satisfy imports
// The actual Command component is causing type conflicts in the Vercel build environment
// Since we're not using it in our UI, we can safely provide empty components

"use client"

import * as React from "react"

type ComponentProps = React.HTMLAttributes<HTMLDivElement> & {
  children?: React.ReactNode
}

// Empty components to satisfy imports
const Command = React.forwardRef<HTMLDivElement, ComponentProps>(
  (props, ref) => <div ref={ref} {...props} />
)
Command.displayName = "Command"

const CommandDialog = React.forwardRef<HTMLDivElement, ComponentProps>(
  (props, ref) => <div ref={ref} {...props} />
)
CommandDialog.displayName = "CommandDialog"

const CommandInput = React.forwardRef<HTMLDivElement, ComponentProps>(
  (props, ref) => <div ref={ref} {...props} />
)
CommandInput.displayName = "CommandInput"

const CommandList = React.forwardRef<HTMLDivElement, ComponentProps>(
  (props, ref) => <div ref={ref} {...props} />
)
CommandList.displayName = "CommandList"

const CommandEmpty = React.forwardRef<HTMLDivElement, ComponentProps>(
  (props, ref) => <div ref={ref} {...props} />
)
CommandEmpty.displayName = "CommandEmpty"

const CommandGroup = React.forwardRef<HTMLDivElement, ComponentProps>(
  (props, ref) => <div ref={ref} {...props} />
)
CommandGroup.displayName = "CommandGroup"

const CommandSeparator = React.forwardRef<HTMLDivElement, ComponentProps>(
  (props, ref) => <div ref={ref} {...props} />
)
CommandSeparator.displayName = "CommandSeparator"

const CommandItem = React.forwardRef<HTMLDivElement, ComponentProps>(
  (props, ref) => <div ref={ref} {...props} />
)
CommandItem.displayName = "CommandItem"

const CommandShortcut = React.forwardRef<HTMLDivElement, ComponentProps>(
  (props, ref) => <div ref={ref} {...props} />
)
CommandShortcut.displayName = "CommandShortcut"

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
}