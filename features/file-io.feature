@StaticMidiSource
Feature: MIDI File I/O
  As a musician
  I want to read and write MIDI files
  So that I can export MIDI tracks from one program and use them in another

  @skip
  Scenario: BamBam should read and write MIDI files
    Given I have exported a MIDI Format 1 file from my DAW
    When I ask BamBam to write a copy of that source file

    Then the output file should be a valid MIDI file
    And the output file should have the same format as the source file
    And the output file should have the same number of tracks as the source file
    And the output file should have the same time division as the source file

    And the output file should have the same track names as the source file
    And the output file should have the same track events as the source file
