Feature: Convert EZDrummer 2 track to General MIDI
  As a musician
  I want to convert EZDrummer 2 tracks to General MIDI
  So that I can maintain flow when copying drum tracks to MuseScore

  @focus
  Scenario: BamBam should produce a valid MIDI track
    Given I have exported an EZDrummer 2 track from my DAW, as MIDI
    When I ask BamBam to remap that track to General MIDI Percussion
    Then the re-mapped track should be a valid MIDI track
    And the re-mapped track should have the same time resolution as the original
    And the re-mapped track should have events at the same times as the original

  Scenario: BamBam should re-map an EZDrummer 2 track to General MIDI Percussion
    Given I have exported an EZDrummer 2 track from my DAW, as MIDI
    When I ask BamBam to remap that track to General MIDI Percussion

    Then re-mapped notes should be on the same MIDI channel as the source notes
    And re-mapped notes should happen at the same time as the source notes
    And re-mapped notes should exist in the General MIDI Percussion map
    And the re-mapped track should have all other events from the original track
